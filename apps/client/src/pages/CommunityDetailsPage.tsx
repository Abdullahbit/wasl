/**
 * Displays full community details with trust indicators and Join/Visit action.
 *
 * The page loads the community via its id, shows recommendation context when
 * navigated from the plan, and handles missing optional fields gracefully.
 */

import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { communityQueryKeys, getCommunity } from '@/features/communities/communityApi';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface LocationState {
  recommendationReason?: string;
}

function formatDate(value: string | null, locale: string): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return value;
  }
}

export function CommunityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t, locale } = useTranslation();
  const recommendationReason = (location.state as LocationState | null)?.recommendationReason;

  const communityQuery = useQuery({
    queryKey: id ? communityQueryKeys.detail(id) : ['communities', 'missing'],
    queryFn: ({ signal }) => getCommunity(id ?? '', signal),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <section className="mx-auto w-full max-w-3xl text-center">
        <h1 className="text-2xl font-bold">{t('communities.details.notFound')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('communities.details.notFoundDescription')}</p>
        <Button asChild className="mt-6">
          <Link to="/communities">{t('communities.details.backToCommunities')}</Link>
        </Button>
      </section>
    );
  }

  if (communityQuery.isPending) {
    return (
      <section className="mx-auto w-full max-w-3xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-6 grid gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </section>
    );
  }

  if (communityQuery.isError) {
    const isNotFound = communityQuery.error.message.includes('404') || communityQuery.error.message.includes('NOT_FOUND');
    return (
      <section className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold">{isNotFound ? t('communities.details.notFound') : t('communities.errorTitle')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {isNotFound ? t('communities.details.notFoundDescription') : t('communities.errorDescription')}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{communityQuery.error.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => communityQuery.refetch()}>
            {t('communities.retry')}
          </Button>
          <Button asChild>
            <Link to="/communities">{t('communities.details.backToCommunities')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  const community = communityQuery.data.data;

  return (
    <section className="mx-auto w-full max-w-3xl">
      <title>
        {community.name} | WASL
      </title>
      <div className="flex items-center gap-2 text-sm">
        <Button asChild variant="ghost" size="sm" className="h-8 rounded-full">
          <Link to="/communities">{t('communities.details.backToCommunities')}</Link>
        </Button>
        <span aria-hidden className="text-muted-foreground">
          {locale === 'ar' ? '←' : '→'}
        </span>
        <Button asChild variant="ghost" size="sm" className="h-8 rounded-full">
          <Link to="/plan">{t('communities.details.backToPlan')}</Link>
        </Button>
      </div>

      {recommendationReason ? (
        <Card className="mt-4 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-primary">{t('communities.details.recommendationContext')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{recommendationReason}</p>
          </CardContent>
        </Card>
      ) : null}

      <header className="mt-6 space-y-3 text-start">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{community.category}</Badge>
          {community.verified ? (
            <Badge variant="default">{t('communities.card.verified')}</Badge>
          ) : (
            <Badge variant="outline">{t('communities.card.notVerified')}</Badge>
          )}
          {community.newcomerFriendly ? <Badge variant="outline" className="border-success text-success">{t('communities.card.newcomerFriendly')}</Badge> : null}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{community.description || t('communities.details.noDescription')}</p>
      </header>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('communities.details.languages')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {community.languages.map((language) => (
                <Badge key={language} variant="outline">
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.details.category')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{community.category}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.details.location')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{community.location ?? '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.details.targetAudience')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{community.targetAudience ?? '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.details.verification')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>{community.verified ? t('communities.details.verified') : t('communities.details.notVerified')}</p>
              <p className={community.newcomerFriendly ? 'text-success' : 'text-muted-foreground'}>
                {community.newcomerFriendly ? t('communities.details.newcomerFriendly') : t('communities.details.notNewcomerFriendly')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('communities.details.lastReviewed')}: {formatDate(community.lastReviewed, locale)}
              </p>
            </CardContent>
          </Card>
        </div>

        {community.interests.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.details.interests')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {community.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {community.universities.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('communities.filters.university')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {community.universities.map((university) => (
                  <Badge key={university} variant="outline">
                    {university}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {community.joinUrl ? (
          <Button asChild size="lg" className="rounded-full">
            <a href={community.joinUrl} target="_blank" rel="noreferrer">
              {t('communities.details.join')}
            </a>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">{t('communities.details.noAction')}</p>
        )}
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link to="/communities">{t('communities.details.backToCommunities')}</Link>
        </Button>
      </div>
    </section>
  );
}
