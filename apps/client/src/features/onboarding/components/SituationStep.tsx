/**
 * Collects the user's current situation: city, university, and arrival stage.
 *
 * This step groups location-related questions to keep the flow short.
 */

import { useId } from 'react';
import { SearchableSelect } from './SearchableSelect';
import { SingleSelectCards } from './SingleSelectCards';
import { arrivalStageOptions, cityOptions, universityOptions } from '../onboardingConstants';

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

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          Your current situation
        </h2>
        <p className="text-sm text-muted-foreground">Tell us where you are based and how long you have been in Türkiye.</p>
      </header>

      <SearchableSelect
        id="onboarding-city"
        label="City"
        placeholder="Start typing e.g. Istanbul"
        description="We prioritize Istanbul but you can choose any supported city."
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
        label="University"
        placeholder="Search universities e.g. Beykoz University"
        description="Start typing to filter. Your exact entry is saved even if not listed."
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
        label="Arrival stage"
        description="How long have you been in Türkiye?"
        options={arrivalStageOptions}
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
