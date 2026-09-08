/**
 * @vitest-environment jsdom
 * Tests for ProfilePage lifecycle, view mode, edit mode, validation, error safety, and cancel flows.
 */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfilePage } from './ProfilePage';
import { setActiveProfileId } from '../features/profiles/profileApi';

class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null { return this.store[key] ?? null; }
  setItem(key: string, value: string): void { this.store[key] = String(value); }
  removeItem(key: string): void { delete this.store[key]; }
  clear(): void { this.store = {}; }
}

const mockStorage = new MockLocalStorage();

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ProfilePage', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal('localStorage', mockStorage);
    mockStorage.clear();
  });

  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('A. No active profile ID: displays onboarding CTA and makes no network request', async () => {
    globalThis.fetch = vi.fn();

    renderWithProviders(<ProfilePage />);

    expect(await screen.findByText('No profile found')).toBeDefined();
    expect(screen.getByText('Start Onboarding')).toBeDefined();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('B & C. Loading and Loaded: displays skeleton then renders persisted Ahmed values', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
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

    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      if (options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: ahmedProfile }),
        });
      }
      return Promise.reject(new Error('Unexpected fetch'));
    });

    renderWithProviders(<ProfilePage />);

    // Renders Ahmed details
    expect(await screen.findByText('Beykoz University')).toBeDefined();
    expect(screen.getByText('Computer Engineering')).toBeDefined();
    expect(screen.getByText('First Week')).toBeDefined();
    expect(screen.getByText('Beginner')).toBeDefined();
    expect(screen.getByText('Software')).toBeDefined();
    expect(screen.getByText('AI')).toBeDefined();
    expect(screen.getByText('Career')).toBeDefined();
    expect(screen.getByText('Networking')).toBeDefined();
    expect(screen.getByText('Edit profile')).toBeDefined();
  });

  it('D. Edit: clicking Edit opens form initialized with backend values', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
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

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: ahmedProfile }),
    });

    renderWithProviders(<ProfilePage />);

    const editButton = await screen.findByRole('button', { name: 'Edit profile' });
    fireEvent.click(editButton);

    expect(await screen.findByRole('heading', { name: 'Edit Profile' })).toBeDefined();
    const universityInput = screen.getByLabelText(/University/);
    expect((universityInput as HTMLInputElement).value).toBe('Beykoz University');
    const specializationInput = screen.getByLabelText(/Specialization/);
    expect((specializationInput as HTMLInputElement).value).toBe('Computer Engineering');
  });

  it('E. Validation: clearing required field shows validation error and prevents save', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software'],
      goals: ['Career'],
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: ahmedProfile }),
    });

    renderWithProviders(<ProfilePage />);

    const editBtn = await screen.findByRole('button', { name: 'Edit profile' });
    fireEvent.click(editBtn);

    const cityInput = await screen.findByLabelText(/City/);
    fireEvent.change(cityInput, { target: { value: '' } });

    const saveBtn = screen.getAllByRole('button', { name: 'Save changes' })[0]!;
    fireEvent.click(saveBtn);

    expect(await screen.findByText('City is required')).toBeDefined();
  });

  it('F. Save success: submits updated payload and displays success message', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
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

    const updatedProfile = {
      ...ahmedProfile,
      turkishLevel: 'Intermediate',
    };

    let putCalled = false;
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      if (options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: ahmedProfile }),
        });
      }
      if (options?.method === 'PUT') {
        putCalled = true;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: updatedProfile }),
        });
      }
      return Promise.reject(new Error('Unexpected fetch'));
    });

    renderWithProviders(<ProfilePage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Edit profile' }));

    const turkishSelect = await screen.findByLabelText(/Turkish level/);
    fireEvent.change(turkishSelect, { target: { value: 'Intermediate' } });

    fireEvent.click(screen.getAllByRole('button', { name: 'Save changes' })[0]!);

    await waitFor(() => {
      expect(putCalled).toBe(true);
    });

    expect(await screen.findByText('Profile updated successfully.')).toBeDefined();
    expect(screen.getByText('Intermediate')).toBeDefined();
  });

  it('G. Save failure: preserves edits and shows safe error without exposing internals', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software'],
      goals: ['Career'],
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      if (options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: ahmedProfile }),
        });
      }
      if (options?.method === 'PUT') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({
            error: {
              code: 'INTERNAL_ERROR',
              message: 'PrismaClientKnownRequestError: connection failure at port 5432',
            },
          }),
        });
      }
      return Promise.reject(new Error('Unexpected'));
    });

    renderWithProviders(<ProfilePage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Edit profile' }));

    const specializationInput = await screen.findByLabelText(/Specialization/);
    fireEvent.change(specializationInput, { target: { value: 'Data Science' } });

    fireEvent.click(screen.getAllByRole('button', { name: 'Save changes' })[0]!);

    // Safe error message must be shown
    expect(await screen.findByText("We couldn't save your changes. Your edits have been kept.")).toBeDefined();
    // Raw internal message must NOT be shown
    expect(screen.queryByText(/PrismaClientKnownRequestError/)).toBeNull();
    // User edits must be preserved in form
    expect((specializationInput as HTMLInputElement).value).toBe('Data Science');
  });

  it('H. Cancel: restores view mode and discards uncommitted edits', async () => {
    setActiveProfileId('profile-ahmed-123');

    const ahmedProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: ['Software'],
      goals: ['Career'],
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: ahmedProfile }),
    });

    renderWithProviders(<ProfilePage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Edit profile' }));

    const specializationInput = await screen.findByLabelText(/Specialization/);
    fireEvent.change(specializationInput, { target: { value: 'Something Else' } });

    fireEvent.click(screen.getAllByRole('button', { name: 'Cancel' })[0]!);

    // Back to view mode with original values
    expect(await screen.findByText('Computer Engineering')).toBeDefined();
    expect(screen.queryByText('Something Else')).toBeNull();
  });

  it('I. Missing optional fields: renders Not provided safely', async () => {
    setActiveProfileId('profile-ahmed-123');

    const incompleteProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      city: 'Istanbul',
      university: 'Beykoz University',
      arrivalStage: 'First Week',
      turkishLevel: 'Beginner',
      specialization: 'Computer Engineering',
      interests: [],
      goals: [],
      createdAt: '2026-09-08T12:00:00.000Z',
      updatedAt: '2026-09-08T12:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: incompleteProfile }),
    });

    renderWithProviders(<ProfilePage />);

    expect(await screen.findByText('Beykoz University')).toBeDefined();
    const notProvidedElements = screen.getAllByText('Not provided');
    expect(notProvidedElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('null')).toBeNull();
    expect(screen.queryByText('undefined')).toBeNull();
  });
});
