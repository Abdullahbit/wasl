/**
 * Collects the user's background: Turkish level and specialization.
 */

import { useId, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SingleSelectCards } from './SingleSelectCards';
import { specializationSuggestions } from '../onboardingConstants';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface BackgroundStepProps {
  turkishLevel: string | undefined;
  specialization: string;
  onTurkishLevelChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onBlurField: (field: string) => void;
  errors: {
    turkishLevel?: string | undefined;
    specialization?: string | undefined;
  };
  disabled?: boolean | undefined;
}

export function BackgroundStep({
  turkishLevel,
  specialization,
  onTurkishLevelChange,
  onSpecializationChange,
  onBlurField,
  errors,
  disabled,
}: BackgroundStepProps) {
  const headingId = useId();
  const { t } = useTranslation();
  const specializationInputId = 'onboarding-specialization';
  const specializationErrorId = useId();
  const specializationDescriptionId = useId();
  const hasSpecializationError = Boolean(errors.specialization);

  const translatedTurkishOptions = useMemo(
    () => [
      { value: 'None', label: t('onboarding.fields.turkishLevel.options.none'), description: t('onboarding.fields.turkishLevel.options.noneDesc') },
      { value: 'Beginner', label: t('onboarding.fields.turkishLevel.options.beginner'), description: t('onboarding.fields.turkishLevel.options.beginnerDesc') },
      { value: 'Intermediate', label: t('onboarding.fields.turkishLevel.options.intermediate'), description: t('onboarding.fields.turkishLevel.options.intermediateDesc') },
      { value: 'Advanced', label: t('onboarding.fields.turkishLevel.options.advanced'), description: t('onboarding.fields.turkishLevel.options.advancedDesc') },
      { value: 'Native', label: t('onboarding.fields.turkishLevel.options.native'), description: t('onboarding.fields.turkishLevel.options.nativeDesc') },
    ],
    [t],
  );

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          {t('onboarding.steps.background.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('onboarding.steps.background.description')}</p>
      </header>

      <SingleSelectCards
        label={t('onboarding.fields.turkishLevel.label')}
        description={t('onboarding.fields.turkishLevel.description')}
        options={translatedTurkishOptions}
        value={turkishLevel}
        onChange={onTurkishLevelChange}
        error={errors.turkishLevel}
        name="turkishLevel"
        required
        disabled={disabled}
      />

      <div className="grid gap-2">
        <Label htmlFor={specializationInputId} className="flex items-center gap-1">
          {t('onboarding.fields.specialization.label')} <span aria-hidden="true" className="text-destructive"> *</span>
          <span className="sr-only"> required</span>
        </Label>
        <p id={specializationDescriptionId} className="text-sm text-muted-foreground">
          {t('onboarding.fields.specialization.description')}
        </p>
        <Input
          id={specializationInputId}
          list={`${specializationInputId}-suggestions`}
          value={specialization}
          onChange={(event) => onSpecializationChange(event.target.value)}
          onBlur={() => onBlurField('specialization')}
          placeholder={t('onboarding.fields.specialization.placeholder')}
          autoComplete="off"
          aria-invalid={hasSpecializationError}
          aria-describedby={[specializationDescriptionId, hasSpecializationError ? specializationErrorId : null].filter(Boolean).join(' ') || undefined}
          aria-errormessage={hasSpecializationError ? specializationErrorId : undefined}
          disabled={disabled}
          className={cn(hasSpecializationError && 'border-destructive focus-visible:ring-destructive')}
        />
        <datalist id={`${specializationInputId}-suggestions`}>
          {specializationSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        {hasSpecializationError ? (
          <p id={specializationErrorId} role="alert" className="text-sm font-medium text-destructive">
            {errors.specialization}
          </p>
        ) : null}
      </div>
    </section>
  );
}
