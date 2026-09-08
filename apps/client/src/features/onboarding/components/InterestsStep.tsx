/**
 * Collects the user's interests through multi-select chips.
 */

import { useId } from 'react';
import { MultiSelectChips } from './MultiSelectChips';
import { interestOptions } from '../onboardingConstants';

interface InterestsStepProps {
  interests: string[];
  onInterestsChange: (values: string[]) => void;
  error?: string | undefined;
  disabled?: boolean | undefined;
}

export function InterestsStep({ interests, onInterestsChange, error, disabled }: InterestsStepProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          Your interests
        </h2>
        <p className="text-sm text-muted-foreground">
          Select topics you enjoy. Your answers help WASL recommend communities and resources relevant to you.
        </p>
      </header>

      <MultiSelectChips
        label="Interests"
        description="Choose one or more. You can change them later."
        options={interestOptions}
        values={interests}
        onChange={onInterestsChange}
        error={error}
        disabled={disabled}
      />
    </section>
  );
}
