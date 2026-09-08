/**
 * Displays the personalized plan with AI-generated next steps and deterministic fallback.
 *
 * The page connects to POST /api/v1/ai/navigate and falls back to
 * GET /api/v1/recommendations. All states (loading, empty, error, populated)
 * use design-system components and support RTL.
 */

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DeterministicCard } from '@/features/recommendations/components/DeterministicCard';
import { NavigatorStepCard } from '@/features/recommendations/components/NavigatorStepCard';
import { getDeterministicRecommendations, getNavigatorRecommendations, recommendationQueryKeys } from '@/features/recommendations/recommendationApi';
import { useTranslation } from '@/lib/i18n/useTranslation';

const MAXIMUM_NAVIGATOR_STEPS = 5;
const MAXIMUM_DETERMINISTIC_CARDS = 5;
const MAXIMUM_SECONDARY_DETERMINISTIC_CARDS = 3;
const LOADING_SKELETON_COUNT = 4;

export function PlanPage() {
  const { t } = useTranslation();

  const navigatorQuery = useQuery({
    queryKey: recommendationQueryKeys.navigator,
    queryFn: ({ signal }) => getNavigatorRecommendations(signal),
  });

  const needsDeterministicFallback = navigatorQuery.isError || (navigatorQuery.isSuccess && !navigatorQuery.data.navigator);

  const deterministicQuery = useQuery({
    queryKey: recommendationQueryKeys.deterministic,
    queryFn: ({ signal }) => getDeterministicRecommendations(signal),
    enabled: needsDeterministicFallback,
  });

  const isNavigatorLoading = navigatorQuery.isPending;
  const isFallbackLoading = needsDeterministicFallback && deterministicQuery.isPending;
  const isLoading = isNavigatorLoading || isFallbackLoading;
  const isError = navigatorQuery.isError && (!needsDeterministicFallback || deterministicQuery.isError);
  const errorMessage = deterministicQuery.error?.message ?? navigatorQuery.error?.message ?? '';

  // Prefer AI navigator steps, fallback to deterministic
  const navigatorSteps = navigatorQuery.data?.navigator?.nextSteps ?? [];
  const hasNavigator = navigatorSteps.length > 0;
  const deterministicList = deterministicQuery.data?.data ?? navigatorQuery.data?.deterministic ?? [];
  const shouldShowDeterministic = !hasNavigator && deterministicList.length > 0;
  const warningMessage = navigatorQuery.data?.warning;

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-5xl">
        <title>{t('plan.pageTitle')}</title>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: LOADING_SKELETON_COUNT }).map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    const isProfileRequired = errorMessage.includes('PROFILE_REQUIRED') || errorMessage.includes('Complete onboarding');
    return (
      <section className="mx-auto w-full max-w-2xl text-center">
        <title>{t('plan.pageTitle')}</title>
        <h1 className="text-2xl font-bold">{t('plan.errorTitle')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          {isProfileRequired ? t('plan.emptyDescription') : t('plan.errorDescription')}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{errorMessage}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigatorQuery.refetch()}>
            {t('plan.retry')}
          </Button>
          {isProfileRequired ? (
            <Button asChild>
              <Link to="/onboarding">{t('onboarding.actions.continue')}</Link>
            </Button>
          ) : null}
        </div>
      </section>
    );
  }

  if (!hasNavigator && deterministicList.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl text-center">
        <title>{t('plan.pageTitle')}</title>
        <h1 className="text-2xl font-bold">{t('plan.emptyTitle')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{t('plan.emptyDescription')}</p>
        <Button asChild className="mt-6">
          <Link to="/communities">{t('plan.emptyAction')}</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <title>{t('plan.pageTitle')}</title>
      <header className="space-y-2 text-start">
        <h1 className="text-3xl font-bold tracking-tight">{t('plan.title')}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{t('plan.subtitle')}</p>
        {warningMessage ? (
          <Card className="border-warning/30 bg-warning-muted">
            <CardContent className="p-3 text-sm text-warning-foreground">{warningMessage}</CardContent>
          </Card>
        ) : null}
        {navigatorQuery.data?.navigator?.summary ? (
          <p className="max-w-3xl rounded-lg bg-muted p-4 text-sm leading-relaxed text-muted-foreground">{navigatorQuery.data.navigator.summary}</p>
        ) : null}
      </header>

      {hasNavigator ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {navigatorSteps.slice(0, MAXIMUM_NAVIGATOR_STEPS).map((step, index) => (
            <NavigatorStepCard key={`${step.title}-${index}`} step={step} index={index} />
          ))}
        </div>
      ) : null}

      {shouldShowDeterministic ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">{t('plan.deterministicTitle')}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {deterministicList.slice(0, MAXIMUM_DETERMINISTIC_CARDS).map((recommendation) => (
              <DeterministicCard key={recommendation.communityId} recommendation={recommendation} />
            ))}
          </div>
        </div>
      ) : null}

      {hasNavigator && deterministicList.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold">{t('plan.deterministicTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('plan.warning')}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {deterministicList.slice(0, MAXIMUM_SECONDARY_DETERMINISTIC_CARDS).map((recommendation) => (
              <DeterministicCard key={recommendation.communityId} recommendation={recommendation} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
