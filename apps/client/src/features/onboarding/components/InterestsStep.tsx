/**
 * Collects the user's interests through multi-select chips.
 */

import { useId } from 'react';
import { MultiSelectChips } from './MultiSelectChips';
import { interestOptions } from '../onboardingConstants';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface InterestsStepProps {
  interests: string[];
  onInterestsChange: (values: string[]) => void;
  error?: string | undefined;
  disabled?: boolean | undefined;
}

export function InterestsStep({ interests, onInterestsChange, error, disabled }: InterestsStepProps) {
  const headingId = useId();
  const { t } = useTranslation();

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          {t('onboarding.steps.interests.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('onboarding.steps.interests.description')}</p>
      </header>

      <MultiSelectChips
        label={t('onboarding.steps.interests.label')}
        description={t('onboarding.steps.interests.descriptionText')}
        options={interestOptions}
        values={interests}
        onChange={onInterestsChange}
        error={error}
        disabled={disabled}
      />
    </section>
  );
}
