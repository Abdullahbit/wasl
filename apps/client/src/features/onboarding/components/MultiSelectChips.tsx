/**
 * Renders multi-selection choices as accessible toggle chips.
 *
 * Used for interests and goals. Shows remaining count, prevents exceeding
 * limit before submission, and communicates selected states clearly.
 */

import { cn } from '@/lib/utils';
import { MAX_MULTI_SELECTIONS } from '../onboardingConstants';

interface MultiSelectChipsProps {
  label: string;
  description?: string | undefined;
  options: readonly string[];
  values: string[];
  onChange: (nextValues: string[]) => void;
  error?: string | undefined;
  disabled?: boolean | undefined;
  maximumSelections?: number | undefined;
}

export function MultiSelectChips({
  label,
  description,
  options,
  values,
  onChange,
  error,
  disabled,
  maximumSelections = MAX_MULTI_SELECTIONS,
}: MultiSelectChipsProps) {
  const hasError = Boolean(error);
  const errorId = `${label.toLowerCase().replace(/\s+/g, '-')}-error`;
  const descriptionId = `${label.toLowerCase().replace(/\s+/g, '-')}-description`;
  const selectedCount = values.length;
  const remainingCount = maximumSelections - selectedCount;
  const isLimitReached = selectedCount >= maximumSelections;
  const maximumSelectionLimitForDisplay = MAX_MULTI_SELECTIONS;

  function toggleOption(option: string) {
    if (disabled) return;

    const isSelected = values.includes(option);

    if (isSelected) {
      onChange(values.filter((item) => item !== option));
      return;
    }

    if (isLimitReached) return;

    onChange([...values, option]);
  }

  return (
    <fieldset
      className="grid gap-3"
      aria-invalid={hasError}
      aria-describedby={[description ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(' ') || undefined}
    >
      <div className="flex items-baseline justify-between gap-4">
        <legend className="text-sm font-medium leading-none">{label}</legend>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {selectedCount} selected{maximumSelections < maximumSelectionLimitForDisplay ? ` · ${remainingCount} remaining` : ''}
        </span>
      </div>
      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = values.includes(option);
          const isDisabled = Boolean(disabled || (!isSelected && isLimitReached));

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => toggleOption(option)}
              className={cn(
                'inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                  : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
      {isLimitReached ? (
        <p className="text-sm text-muted-foreground">You have reached the maximum of {maximumSelections} selections.</p>
      ) : null}
    </fieldset>
  );
}
