/**
 * Collects the user's current situation: city, university, and arrival stage.
 *
 * This step groups location-related questions to keep the flow short.
 */

import { useId, useMemo } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { SingleSelectCards } from './SingleSelectCards';
import { cityOptions, universityOptions } from '../onboardingConstants';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface SituationStepProps {
  city: string;
  university: string;
  arrivalStage: string | undefined;
  onCityChange: (value: string) => void;
  onUniversityChange: (value: string) => void;
  onArrivalStageChange: (value: string) => void;
  onBlurField: (field: string) => void;
  errors: {
    city?: string | undefined;
    university?: string | undefined;
    arrivalStage?: string | undefined;
  };
  disabled?: boolean | undefined;
}

export function SituationStep({
  city,
  university,
  arrivalStage,
  onCityChange,
  onUniversityChange,
  onArrivalStageChange,
  onBlurField,
  errors,
  disabled,
}: SituationStepProps) {
  const headingId = useId();
  const { t } = useTranslation();

  const translatedArrivalOptions = useMemo(
    () => [
      { value: 'Preparing', label: t('onboarding.fields.arrivalStage.options.preparing'), description: t('onboarding.fields.arrivalStage.options.preparingDesc') },
      { value: 'First Week', label: t('onboarding.fields.arrivalStage.options.firstWeek'), description: t('onboarding.fields.arrivalStage.options.firstWeekDesc') },
      { value: 'First Month', label: t('onboarding.fields.arrivalStage.options.firstMonth'), description: t('onboarding.fields.arrivalStage.options.firstMonthDesc') },
      { value: 'Settled', label: t('onboarding.fields.arrivalStage.options.settled'), description: t('onboarding.fields.arrivalStage.options.settledDesc') },
    ],
    [t],
  );

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          {t('onboarding.steps.situation.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('onboarding.steps.situation.description')}</p>
      </header>

      <SearchableSelect
        id="onboarding-city"
        label={t('onboarding.fields.city.label')}
        placeholder={t('onboarding.fields.city.placeholder')}
        description={t('onboarding.fields.city.description')}
        value={city}
        onChange={onCityChange}
        onBlur={() => onBlurField('city')}
        options={cityOptions}
        error={errors.city}
        required
        disabled={disabled}
        autoComplete="address-level2"
      />

      <SearchableSelect
        id="onboarding-university"
        label={t('onboarding.fields.university.label')}
        placeholder={t('onboarding.fields.university.placeholder')}
        description={t('onboarding.fields.university.description')}
        value={university}
        onChange={onUniversityChange}
        onBlur={() => onBlurField('university')}
        options={universityOptions}
        error={errors.university}
        required
        disabled={disabled}
        autoComplete="organization"
      />

      <SingleSelectCards
        label={t('onboarding.fields.arrivalStage.label')}
        description={t('onboarding.fields.arrivalStage.description')}
        options={translatedArrivalOptions}
        value={arrivalStage}
        onChange={onArrivalStageChange}
        error={errors.arrivalStage}
        name="arrivalStage"
        required
        disabled={disabled}
      />
    </section>
  );
}
