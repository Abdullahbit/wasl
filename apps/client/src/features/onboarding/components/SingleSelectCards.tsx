/**
 * Renders single-selection options as accessible large-target cards.
 *
 * Used for arrival stage and Turkish level: each option shows clear
 * selected, unselected, focus and disabled states.
 */

import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SingleSelectCardsProps {
  label: string;
  description?: string | undefined;
  options: readonly SelectOption[];
  value: string | undefined;
  onChange: (nextValue: string) => void;
  error?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  name: string;
}

export function SingleSelectCards({
  label,
  description,
  options,
  value,
  onChange,
  error,
  required,
  disabled,
  name,
}: SingleSelectCardsProps) {
  const hasError = Boolean(error);
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;

  return (
    <fieldset
      className="grid gap-3"
      aria-invalid={hasError}
      aria-describedby={[description ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(' ') || undefined}
      aria-errormessage={hasError ? errorId : undefined}
    >
      <legend className="text-sm font-medium leading-none">
        {label}
        {required ? <span aria-hidden="true" className="text-destructive"> *</span> : null}
      </legend>
      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                'relative flex cursor-pointer flex-col gap-1 rounded-lg border bg-card p-4 text-start shadow-soft transition-colors hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                isSelected && 'border-primary bg-primary/5 ring-1 ring-primary',
                disabled && 'cursor-not-allowed opacity-50',
                hasError && !isSelected && 'border-destructive/50',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                disabled={disabled}
                className="sr-only"
                aria-describedby={option.description ? `${name}-${option.value}-desc` : undefined}
              />
              <span className="text-sm font-semibold">{option.label}</span>
              {option.description ? (
                <span id={`${name}-${option.value}-desc`} className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
              {isSelected ? (
                <span className="absolute end-3 top-3 size-2.5 rounded-full bg-primary" aria-hidden />
              ) : null}
            </label>
          );
        })}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
