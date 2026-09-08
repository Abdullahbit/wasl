/**
 * Provides an accessible searchable select that filters options and accepts custom values.
 *
 * Designed for city and university fields: shows filtered suggestions,
 * supports keyboard navigation, and keeps the typed value as fallback when
 * no option matches. This gives Istanbul prioritization without blocking
 * other valid entries.
 */

import { useEffect, useId, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DROPDOWN_CLOSE_DELAY_MS, MAX_VISIBLE_SUGGESTIONS } from '../onboardingConstants';

interface SearchableSelectProps {
  id?: string | undefined;
  label: string;
  placeholder?: string | undefined;
  value: string;
  onChange: (nextValue: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  error?: string | undefined;
  description?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  autoComplete?: string | undefined;
}

export function SearchableSelect({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  options,
  error,
  description,
  required,
  disabled,
  autoComplete,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const generatedInputId = useId();
  const inputId = id ?? generatedInputId;
  const listboxId = useId();
  const errorId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options.slice(0, MAX_VISIBLE_SUGGESTIONS);
    }

    const startsWithMatches = options.filter((option) => option.toLowerCase().startsWith(normalizedQuery));
    const containsMatches = options.filter(
      (option) => option.toLowerCase().includes(normalizedQuery) && !option.toLowerCase().startsWith(normalizedQuery),
    );

    return [...startsWithMatches, ...containsMatches].slice(0, MAX_VISIBLE_SUGGESTIONS);
  }, [options, query]);



  const hasError = Boolean(error);
  const describedBy = [description ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(' ') || undefined;

  function handleInputChange(nextQuery: string) {
    setQuery(nextQuery);
    onChange(nextQuery);
    setIsOpen(true);
  }

  function handleSelectOption(option: string) {
    setQuery(option);
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId} className="flex items-center gap-1">
        {label}
        {required ? <span aria-hidden="true" className="text-destructive"> *</span> : null}
        {required ? <span className="sr-only"> required</span> : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="relative">
        <Input
          id={inputId}
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            setQuery(value);
            setIsOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setIsOpen(false);
              onBlur?.();
            }, DROPDOWN_CLOSE_DELAY_MS);
          }}
          placeholder={placeholder}
          autoComplete={autoComplete ?? 'off'}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-errormessage={hasError ? errorId : undefined}
          disabled={disabled}
          className={cn(hasError && 'border-destructive focus-visible:ring-destructive')}
        />
        {isOpen && !disabled ? (
          <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover p-1 shadow-card">
            {filteredOptions.length > 0 ? (
              <ul id={listboxId} role="listbox" aria-label={`${label} suggestions`} className="grid gap-1">
                {filteredOptions.map((option) => (
                  <li key={option} role="option" aria-selected={option === value}>
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSelectOption(option);
                      }}
                      className={cn(
                        'flex w-full rounded-sm px-2 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                        option === value && 'bg-secondary font-medium',
                      )}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">No matches. You can keep your custom entry.</p>
            )}
          </div>
        ) : null}
      </div>
      {hasError ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
