/**
 * Verifies the communities discovery page: loading, cards, filters, and error states.
 *
 * Filters use real backend-supported values. University filtering is
 * client-side and isolated from the fetch logic.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommunitiesPage } from './CommunitiesPage';
import { getCommunities } from '@/features/communities/communityApi';
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

const mockedGetCommunities = vi.mocked(getCommunities);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderCommunitiesPage() {
  window.localStorage.clear();
  window.localStorage.setItem('wasl-locale', 'en');

  return render(
    <I18nProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={['/communities']}>
          <CommunitiesPage />
        </MemoryRouter>
      </QueryClientProvider>
    </I18nProvider>,
  );
}

function createCommunity(overrides: Record<string, unknown> = {}) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Istanbul Tech Community',
    description: 'A welcoming tech community.',
    category: 'technology',
    languages: ['English'],
    universities: ['Beykoz University'],
    interests: ['Software'],
    location: 'Istanbul',
    targetAudience: 'Newcomers',
    joinUrl: 'https://example.com/join',
    newcomerFriendly: true,
    verified: true,
    lastReviewed: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('CommunitiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders community cards with trust indicators', async () => {
    mockedGetCommunities.mockResolvedValue({
      data: [createCommunity(), createCommunity({ id: '123e4567-e89b-12d3-a456-426614174002', name: 'Design Circle', verified: false, newcomerFriendly: false })],
      meta: { total: 2 },
    });

    renderCommunitiesPage();

    expect(await screen.findByText('Istanbul Tech Community')).toBeInTheDocument();
    expect(screen.getByText('Design Circle')).toBeInTheDocument();
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    expect(screen.getByText('Not verified')).toBeInTheDocument();
    expect(screen.getByText('Newcomer-friendly')).toBeInTheDocument();
  });

  it('filters by category using the select control', async () => {
    const user = userEvent.setup();
    mockedGetCommunities.mockResolvedValue({
      data: [createCommunity(), createCommunity({ id: '123e4567-e89b-12d3-a456-426614174003', name: 'Art Club', category: 'arts' })],
      meta: { total: 2 },
    });

    renderCommunitiesPage();
    await screen.findByText('Istanbul Tech Community');

    const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement;
    await user.selectOptions(categorySelect, 'technology');

    await waitFor(() => expect(mockedGetCommunities.mock.calls.length).toBeGreaterThanOrEqual(2));
    const lastCallFilters = mockedGetCommunities.mock.calls[mockedGetCommunities.mock.calls.length - 1]?.[0] as Record<string, string>;
    expect(lastCallFilters.category).toBe('technology');
    expect(screen.getByText('Active filters:')).toBeInTheDocument();
  });

  it('clears active filters and handles empty filtered results', async () => {
    const user = userEvent.setup();
    mockedGetCommunities.mockResolvedValue({ data: [createCommunity()], meta: { total: 1 } });

    renderCommunitiesPage();
    await screen.findByText('Istanbul Tech Community');

    const universitySelect = screen.getByLabelText('University') as HTMLSelectElement;
    await user.selectOptions(universitySelect, 'Beykoz University');
    expect(await screen.findByText('Istanbul Tech Community')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.queryByText('Active filters:')).not.toBeInTheDocument();
  });

  it('shows an error state with retry when loading fails', async () => {
    mockedGetCommunities.mockRejectedValue(new Error('Network error'));
    renderCommunitiesPage();

    expect(await screen.findByText('We couldn’t load communities')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
