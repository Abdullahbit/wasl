/**
 * Collects the user's goals through multi-select chips.
 */

import { useId } from 'react';
import { MultiSelectChips } from './MultiSelectChips';
import { goalOptions } from '../onboardingConstants';

interface GoalsStepProps {
  goals: string[];
  onGoalsChange: (values: string[]) => void;
  error?: string | undefined;
  disabled?: boolean | undefined;
}

export function GoalsStep({ goals, onGoalsChange, error, disabled }: GoalsStepProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="grid gap-6">
      <header className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold leading-none tracking-tight">
          Your goals
        </h2>
        <p className="text-sm text-muted-foreground">What would you like to achieve? Select all that apply.</p>
      </header>

      <MultiSelectChips
        label="Goals"
        description="Pick the outcomes that matter most for your next months in Türkiye."
        options={goalOptions}
        values={goals}
        onChange={onGoalsChange}
        error={error}
        disabled={disabled}
      />
    </section>
  );
}
