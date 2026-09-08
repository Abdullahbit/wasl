/**
 * Renders the communities discovery page with real API data and filters.
 *
 * The page keeps API access isolated via communityApi, handles all UX
 * states, and displays trust indicators using design-system badges.
 */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communityQueryKeys, getCommunities } from '../features/communities/communityApi';
import { CommunityCard } from '../features/communities/components/CommunityCard';
import { CommunityFilters, type CommunityFiltersValue } from '../features/communities/components/CommunityFilters';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useTranslation } from '../lib/i18n/useTranslation';

const DEFAULT_FILTERS: CommunityFiltersValue = {
  category: '',
  university: '',
  language: '',
};

const LOADING_SKELETON_CARD_COUNT = 6;

export function CommunitiesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<CommunityFiltersValue>(DEFAULT_FILTERS);

  // Server-side filters (category, language) are sent to the API
  const serverFilters = useMemo(() => {
    const next: Record<string, string> = {};
    if (filters.category) next.category = filters.category;
    if (filters.language) next.language = filters.language;
    return next;
  }, [filters.category, filters.language]);

  const communitiesQuery = useQuery({
    queryKey: communityQueryKeys.list(serverFilters),
    queryFn: ({ signal }) => getCommunities(serverFilters, signal),
  });

  // Fetch all communities once to derive stable filter options (real supported values)
  const allCommunitiesQuery = useQuery({
    queryKey: communityQueryKeys.all,
    queryFn: ({ signal }) => getCommunities({}, signal),
  });

  const rawCommunities = useMemo(() => communitiesQuery.data?.data ?? [], [communitiesQuery.data]);
  const allCommunities = useMemo(() => allCommunitiesQuery.data?.data ?? rawCommunities, [allCommunitiesQuery.data, rawCommunities]);

  // Derive filter options from all communities (not just filtered) so options remain available
  const categoryOptions = useMemo(() => {
    const categories = new Set(allCommunities.map((community) => community.category));
    return Array.from(categories).sort();
  }, [allCommunities]);

  const universityOptions = useMemo(() => {
    const universities = new Set(allCommunities.flatMap((community) => community.universities));
    return Array.from(universities).sort();
  }, [allCommunities]);

  const languageOptions = useMemo(() => {
    const languages = new Set(allCommunities.flatMap((community) => community.languages));
    return Array.from(languages).sort();
  }, [allCommunities]);

  // Client-side university filter (backend does not support it as query)
  const filteredCommunities = useMemo(() => {
    if (!filters.university) return rawCommunities;
    return rawCommunities.filter((community) => community.universities.includes(filters.university));
  }, [rawCommunities, filters.university]);

  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  if (communitiesQuery.isPending) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <title>{t('communities.pageTitle')}</title>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <div className="mt-6">
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: LOADING_SKELETON_CARD_COUNT }).map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (communitiesQuery.isError) {
    return (
      <section className="mx-auto w-full max-w-2xl text-center">
        <title>{t('communities.pageTitle')}</title>
        <h1 className="text-2xl font-bold">{t('communities.errorTitle')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{t('communities.errorDescription')}</p>
        <p className="mt-2 text-xs text-muted-foreground">{communitiesQuery.error.message}</p>
        <Button variant="outline" onClick={() => communitiesQuery.refetch()} className="mt-6">
          {t('communities.retry')}
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <title>{t('communities.pageTitle')}</title>
      <header className="space-y-2 text-start">
        <h1 className="text-3xl font-bold tracking-tight">{t('communities.title')}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{t('communities.subtitle')}</p>
      </header>

      <div className="mt-6">
        <CommunityFilters
          value={filters}
          onChange={setFilters}
          categoryOptions={categoryOptions}
          universityOptions={universityOptions}
          languageOptions={languageOptions}
          onClear={handleClearFilters}
        />
      </div>

      {filteredCommunities.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <h2 className="font-semibold">{t('communities.empty')}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t('communities.emptyDescription')}</p>
            {rawCommunities.length > 0 ? (
              <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                {t('communities.filters.clear')}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommunities.map((community) => (
            <li key={community.id} className="flex">
              <CommunityCard community={community} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
