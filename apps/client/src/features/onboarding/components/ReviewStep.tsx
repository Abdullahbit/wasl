/**
 * Summarizes the onboarding answers before submission and allows jumping back to sections.
 */

import { useId, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileInput } from '@wasl/contracts';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ReviewStepProps {
  values: ProfileInput;
  onEditStep: (stepIndex: number) => void;
  disabled?: boolean;
}

export function ReviewStep({ values, onEditStep, disabled }: ReviewStepProps) {
  const headingId = useId();
  const { t } = useTranslation();

  const arrivalStageLabel = useMemo(() => {
    const map: Record<string, string> = {
      Preparing: t('onboarding.fields.arrivalStage.options.preparing'),
      'First Week': t('onboarding.fields.arrivalStage.options.firstWeek'),
      'First Month': t('onboarding.fields.arrivalStage.options.firstMonth'),
      Settled: t('onboarding.fields.arrivalStage.options.settled'),
    };
    return map[values.arrivalStage] ?? values.arrivalStage;
  }, [t, values.arrivalStage]);

  const turkishLevelLabel = useMemo(() => {
    const map: Record<string, string> = {
      None: t('onboarding.fields.turkishLevel.options.none'),
      Beginner: t('onboarding.fields.turkishLevel.options.beginner'),
      Intermediate: t('onboarding.fields.turkishLevel.options.intermediate'),
      Advanced: t('onboarding.fields.turkishLevel.options.advanced'),
      Native: t('onboarding.fields.turkishLevel.options.native'),
    };
    return map[values.turkishLevel] ?? values.turkishLevel;
  }, [t, values.turkishLevel]);

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          {t('onboarding.steps.review.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('onboarding.steps.review.description')}</p>
      </header>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t('onboarding.steps.review.situationCard')}</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(0)} disabled={disabled} aria-label={t('onboarding.steps.review.editSituation')}>
              {t('onboarding.steps.review.edit')}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm text-start">
            <p>
              <span className="font-medium">{t('onboarding.steps.review.city')}:</span> {values.city || '—'}
            </p>
            <p>
              <span className="font-medium">{t('onboarding.steps.review.university')}:</span> {values.university || '—'}
            </p>
            <p>
              <span className="font-medium">{t('onboarding.steps.review.arrivalStage')}:</span> {arrivalStageLabel}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t('onboarding.steps.review.backgroundCard')}</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(1)} disabled={disabled} aria-label={t('onboarding.steps.review.editBackground')}>
              {t('onboarding.steps.review.edit')}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm text-start">
            <p>
              <span className="font-medium">{t('onboarding.steps.review.turkishLevel')}:</span> {turkishLevelLabel}
            </p>
            <p>
              <span className="font-medium">{t('onboarding.steps.review.specialization')}:</span> {values.specialization || '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t('onboarding.steps.review.interestsCard')}</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(2)} disabled={disabled} aria-label={t('onboarding.steps.review.editInterests')}>
              {t('onboarding.steps.review.edit')}
            </Button>
          </CardHeader>
          <CardContent>
            {values.interests.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {values.interests.map((interest) => (
                  <li key={interest}>
                    <Badge variant="secondary">{interest}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('onboarding.steps.review.noInterests')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">{t('onboarding.steps.review.goalsCard')}</CardTitle>
            <Button variant="ghost" size="sm" type="button" onClick={() => onEditStep(3)} disabled={disabled} aria-label={t('onboarding.steps.review.editGoals')}>
              {t('onboarding.steps.review.edit')}
            </Button>
          </CardHeader>
          <CardContent>
            {values.goals.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {values.goals.map((goal) => (
                  <li key={goal}>
                    <Badge variant="secondary">{goal}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('onboarding.steps.review.noGoals')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
