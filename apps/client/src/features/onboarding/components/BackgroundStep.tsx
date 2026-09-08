/**
 * Collects the user's background: Turkish level and specialization.
 */

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SingleSelectCards } from './SingleSelectCards';
import { specializationSuggestions, turkishLevelOptions } from '../onboardingConstants';
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
  const specializationInputId = 'onboarding-specialization';
  const specializationErrorId = useId();
  const specializationDescriptionId = useId();
  const hasSpecializationError = Boolean(errors.specialization);

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          Your background
        </h2>
        <p className="text-sm text-muted-foreground">Share your language level and field of study.</p>
      </header>

      <SingleSelectCards
        label="Turkish level"
        description="Choose the option that best fits you right now."
        options={turkishLevelOptions}
        value={turkishLevel}
        onChange={onTurkishLevelChange}
        error={errors.turkishLevel}
        name="turkishLevel"
        required
        disabled={disabled}
      />

      <div className="grid gap-2">
        <Label htmlFor={specializationInputId} className="flex items-center gap-1">
          Specialization <span aria-hidden="true" className="text-destructive"> *</span>
          <span className="sr-only"> required</span>
        </Label>
        <p id={specializationDescriptionId} className="text-sm text-muted-foreground">
          Your field of study, e.g. Computer Engineering. You can type a custom value.
        </p>
        <Input
          id={specializationInputId}
          list={`${specializationInputId}-suggestions`}
          value={specialization}
          onChange={(event) => onSpecializationChange(event.target.value)}
          onBlur={() => onBlurField('specialization')}
          placeholder="e.g. Computer Engineering"
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
