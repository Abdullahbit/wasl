/**
 * Collects the user's goals through multi-select chips.
 */

import { useId } from 'react';
import { MultiSelectChips } from './MultiSelectChips';
import { goalOptions } from '../onboardingConstants';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface GoalsStepProps {
  goals: string[];
  onGoalsChange: (values: string[]) => void;
  error?: string | undefined;
  disabled?: boolean | undefined;
}

export function GoalsStep({ goals, onGoalsChange, error, disabled }: GoalsStepProps) {
  const headingId = useId();
  const { t } = useTranslation();

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          {t('onboarding.steps.goals.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('onboarding.steps.goals.description')}</p>
      </header>

      <MultiSelectChips
        label={t('onboarding.steps.goals.label')}
        description={t('onboarding.steps.goals.descriptionText')}
        options={goalOptions}
        values={goals}
        onChange={onGoalsChange}
        error={error}
        disabled={disabled}
      />
    </section>
  );
}
