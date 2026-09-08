/**
 * Verifies the community details page: loading, populated, missing, and error states.
 *
 * The details page shows recommendation context when navigated from the plan
 * and handles Join actions with real backend URLs.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommunityDetailsPage } from './CommunityDetailsPage';
import { getCommunity } from '@/features/communities/communityApi';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

vi.mock('@/features/communities/communityApi', () => ({
  communityQueryKeys: {
    all: ['communities'],
    list: (filters: Record<string, string>) => ['communities', filters],
    detail: (id: string) => ['communities', id],
  },
  getCommunities: vi.fn(),
  getCommunity: vi.fn(),
}));

const mockedGetCommunity = vi.mocked(getCommunity);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderDetailsPage(communityId: string, state?: Record<string, string>) {
  window.localStorage.clear();
  window.localStorage.setItem('wasl-locale', 'en');

  return render(
    <I18nProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={[{ pathname: `/communities/${communityId}`, state }]}>
          <Routes>
            <Route path="/communities/:id" element={<CommunityDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </I18nProvider>,
  );
}

const sampleCommunity = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Istanbul Tech Community',
  description: 'A welcoming tech community for newcomers.',
  category: 'technology',
  languages: ['English', 'Turkish'],
  universities: ['Beykoz University'],
  interests: ['Software', 'Artificial Intelligence'],
  location: 'Istanbul',
  targetAudience: 'Newcomers',
  joinUrl: 'https://example.com/join',
  newcomerFriendly: true,
  verified: true,
  lastReviewed: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CommunityDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays full details with trust indicators and Join action', async () => {
    mockedGetCommunity.mockResolvedValue({ data: sampleCommunity });

    renderDetailsPage(sampleCommunity.id);

    expect(await screen.findByText('Istanbul Tech Community')).toBeInTheDocument();
    expect(screen.getByText('Verified by WASL')).toBeInTheDocument();
    expect(screen.getAllByText('Newcomer-friendly').length).toBeGreaterThan(0);
    expect(screen.getByText('Beykoz University')).toBeInTheDocument();

    const joinLink = screen.getByRole('link', { name: 'Join' });
    expect(joinLink).toHaveAttribute('href', 'https://example.com/join');
    expect(joinLink).toHaveAttribute('target', '_blank');
  });

  it('shows recommendation context when navigated from the plan', async () => {
    mockedGetCommunity.mockResolvedValue({ data: sampleCommunity });

    renderDetailsPage(sampleCommunity.id, { recommendationReason: 'Matches your Software interest.' });

    expect(await screen.findByText('Why this is relevant for you')).toBeInTheDocument();
    expect(screen.getByText('Matches your Software interest.')).toBeInTheDocument();
  });

  it('handles missing join URL gracefully', async () => {
    mockedGetCommunity.mockResolvedValue({ data: { ...sampleCommunity, joinUrl: null } });

    renderDetailsPage(sampleCommunity.id);

    expect(await screen.findByText('No join link available')).toBeInTheDocument();
  });

  it('shows a not-found state for unknown communities', async () => {
    mockedGetCommunity.mockRejectedValue(new Error('404 NOT_FOUND Community not found.'));

    renderDetailsPage(sampleCommunity.id);

    expect(await screen.findByText('Community not found.')).toBeInTheDocument();
  });
});
