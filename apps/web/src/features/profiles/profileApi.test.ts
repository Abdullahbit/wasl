/**
 * Tests for profileApi methods and activeProfileId session management.
 */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  getActiveProfileId,
  setActiveProfileId,
  getProfile,
  saveProfile,
} from './profileApi';
import type { ProfileInput } from '@wasl/contracts';

// In Node/Vitest default environment, provide an in-memory localStorage polyfill for testing
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('profileApi', () => {
  const originalFetch = globalThis.fetch;
  const mockStorage = new MockLocalStorage();

  beforeEach(() => {
    vi.stubGlobal('localStorage', mockStorage);
    mockStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('manages activeProfileId in localStorage without storing raw profile data', () => {
    expect(getActiveProfileId()).toBeNull();
    setActiveProfileId('test-uuid-1234');
    expect(getActiveProfileId()).toBe('test-uuid-1234');
    // Ensure only the ID key is touched
    expect(mockStorage.getItem('wasl_active_profile_id')).toBe('test-uuid-1234');
    expect(mockStorage.getItem('city')).toBeNull();
    setActiveProfileId(null);
    expect(getActiveProfileId()).toBeNull();
  });

  it('getProfile sends x-profile-id header and validates response', async () => {
    setActiveProfileId('profile-uuid-1');

    const mockProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software', 'AI'],
      goals: ['Career', 'Networking'],
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    let sentHeaders: HeadersInit | undefined;
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      sentHeaders = options?.headers;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockProfile }),
      });
    });

    const response = await getProfile();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/v1/profile',
      expect.objectContaining({ method: 'GET' })
    );
    expect((sentHeaders as Record<string, string>)['x-profile-id']).toBe('profile-uuid-1');
    expect(response.data.university).toBe('Beykoz University');
    expect(response.data.specialization).toBe('Computer Engineering');
  });

  it('saveProfile sends PUT with body and headers, and updates activeProfileId on creation', async () => {
    const input: ProfileInput = {
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software', 'AI'],
      goals: ['Career', 'Networking'],
    };

    const mockResponse = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ...input,
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockResponse }),
    });

    const response = await saveProfile(input);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/v1/profile',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(input),
      })
    );
    expect(getActiveProfileId()).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(response.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('saveProfile with existing profileId preserves and forwards x-profile-id', async () => {
    setActiveProfileId('existing-uuid');

    const input: ProfileInput = {
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Intermediate',
      specialization: 'Computer Engineering',
      interests: ['Software', 'AI'],
      goals: ['Career', 'Networking'],
    };

    const mockResponse = {
      id: 'a1b2c3d4-e5f6-4a1b-8c2d-111122223333',
      ...input,
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    let sentHeaders: HeadersInit | undefined;
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      sentHeaders = options?.headers;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockResponse }),
      });
    });

    await saveProfile(input);

    expect((sentHeaders as Record<string, string>)['x-profile-id']).toBe('existing-uuid');
  });

  it('onboarding profile creation updates activeProfileId and subsequent getProfile sends that ID', async () => {
    const newProfile: ProfileInput = {
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software', 'AI'],
      goals: ['Career', 'Networking'],
    };

    const createdRecord = {
      id: '987fcdeb-51a2-43d7-b890-123456789abc',
      ...newProfile,
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    let getHeaders: HeadersInit | undefined;
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      if (options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: createdRecord }),
        });
      }
      if (options?.method === 'GET') {
        getHeaders = options?.headers;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: createdRecord }),
        });
      }
      return Promise.reject(new Error('Unexpected fetch call'));
    });

    // 1. Initial state has no active ID
    expect(getActiveProfileId()).toBeNull();

    // 2. Onboarding creates profile via saveProfile
    const saveResult = await saveProfile(newProfile);
    expect(saveResult.data.id).toBe('987fcdeb-51a2-43d7-b890-123456789abc');
    expect(getActiveProfileId()).toBe('987fcdeb-51a2-43d7-b890-123456789abc');

    // 3. /profile consumes getProfile() which automatically sends the active ID
    const getResult = await getProfile();
    expect((getHeaders as Record<string, string>)['x-profile-id']).toBe('987fcdeb-51a2-43d7-b890-123456789abc');
    expect(getResult.data.university).toBe('Beykoz University');
    expect(getResult.data.specialization).toBe('Computer Engineering');
  });
});
