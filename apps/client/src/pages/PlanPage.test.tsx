/**
 * Verifies the personalized plan page: loading, populated, empty, and error states.
 *
 * The plan prefers AI navigator steps and falls back to deterministic matches.
 * All API access is mocked at the feature layer to keep tests focused.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlanPage } from './PlanPage';
import { getDeterministicRecommendations, getNavigatorRecommendations } from '@/features/recommendations/recommendationApi';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

vi.mock('@/features/recommendations/recommendationApi', () => ({
  recommendationQueryKeys: {
    all: ['recommendations'],
    navigator: ['recommendations', 'navigator'],
    deterministic: ['recommendations', 'deterministic'],
  },
  getNavigatorRecommendations: vi.fn(),
  getDeterministicRecommendations: vi.fn(),
}));

const mockedGetNavigator = vi.mocked(getNavigatorRecommendations);
const mockedGetDeterministic = vi.mocked(getDeterministicRecommendations);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderPlanPage() {
  window.localStorage.clear();
  window.localStorage.setItem('wasl-locale', 'en');

  return render(
    <I18nProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={['/plan']}>
          <PlanPage />
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
  interests: ['Software'],
  location: 'Istanbul',
  targetAudience: 'Newcomers interested in Software',
  joinUrl: 'https://example.com/join',
  newcomerFriendly: true,
  verified: true,
  lastReviewed: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('PlanPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeletons while fetching the plan', () => {
    mockedGetNavigator.mockImplementation(() => new Promise(() => {}));
    const { container } = renderPlanPage();

    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });

  it('displays AI navigator steps with Why This explanations', async () => {
    const user = userEvent.setup();
    mockedGetNavigator.mockResolvedValue({
      navigator: {
        summary: 'Welcome Ahmed, here are your next steps.',
        nextSteps: [
          {
            title: 'Join Istanbul Tech Community',
            description: 'Meet peers interested in Software.',
            priority: 'High' as const,
            reason: 'Matches your Software interest and Beykoz University.',
            relatedCommunityId: sampleCommunity.id,
          },
          {
            title: 'Improve your Turkish',
            description: 'Practice everyday conversations.',
            priority: 'Medium' as const,
            reason: 'You selected Beginner Turkish level.',
          },
        ],
      },
      deterministic: [],
    });
    mockedGetDeterministic.mockResolvedValue({ data: [], meta: { total: 0 } });

    renderPlanPage();

    expect(await screen.findByText('Join Istanbul Tech Community')).toBeInTheDocument();
    expect(screen.getByText('Welcome Ahmed, here are your next steps.')).toBeInTheDocument();

    const whyButtons = await screen.findAllByRole('button', { name: /Why this\?/i });
    expect(whyButtons.length).toBeGreaterThan(0);

    await user.click(whyButtons[0] as HTMLElement);
    expect(await screen.findByText('Matches your Software interest and Beykoz University.')).toBeInTheDocument();
  });

  it('falls back to deterministic matches when navigator is missing', async () => {
    mockedGetNavigator.mockResolvedValue({ deterministic: [], warning: 'AI unavailable' });
    mockedGetDeterministic.mockResolvedValue({
      data: [
        {
          communityId: sampleCommunity.id,
          community: sampleCommunity,
          score: { score: 65, breakdown: { 'University match': 30 }, reasonCodes: ['UNIVERSITY_MATCH'] as never[] },
        },
      ],
      meta: { total: 1 },
    });

    renderPlanPage();

    expect(await screen.findByText('Recommended for you')).toBeInTheDocument();
    expect(await screen.findByText('Istanbul Tech Community')).toBeInTheDocument();
  });

  it('shows an empty state with a path to communities when no data exists', async () => {
    mockedGetNavigator.mockResolvedValue({ deterministic: [] });
    mockedGetDeterministic.mockResolvedValue({ data: [], meta: { total: 0 } });

    renderPlanPage();

    expect(await screen.findByText('No personalized recommendations yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore communities' })).toHaveAttribute('href', '/communities');
  });

  it('shows an error state with retry when both sources fail', async () => {
    const user = userEvent.setup();
    mockedGetNavigator.mockRejectedValue(new Error('Network error'));
    mockedGetDeterministic.mockRejectedValue(new Error('Network error'));

    renderPlanPage();

    expect(await screen.findByText('We couldn’t load your plan')).toBeInTheDocument();

    mockedGetNavigator.mockResolvedValue({
      navigator: {
        summary: 'Recovered.',
        nextSteps: [
          {
            title: 'Recovered step',
            description: 'Recovered description.',
            priority: 'Low' as const,
            reason: 'Recovered reason.',
          },
        ],
      },
      deterministic: [],
    });

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(mockedGetNavigator).toHaveBeenCalledTimes(2));
  });
});
