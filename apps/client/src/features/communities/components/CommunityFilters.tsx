/**
 * Provides reusable filter controls for community discovery.
 *
 * Filters operate on real backend-supported values (category, language)
 * and client-side university. Active filters are visible, clearable, and
 * work on mobile via a stacked layout.
 */

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/useTranslation';

export interface CommunityFiltersValue {
  category: string;
  university: string;
  language: string;
}

interface CommunityFiltersProps {
  value: CommunityFiltersValue;
  onChange: (nextValue: CommunityFiltersValue) => void;
  categoryOptions: readonly string[];
  universityOptions: readonly string[];
  languageOptions: readonly string[];
  onClear: () => void;
}

export function CommunityFilters({ value, onChange, categoryOptions, universityOptions, languageOptions, onClear }: CommunityFiltersProps) {
  const { t } = useTranslation();
  const categoryId = useId();
  const universityId = useId();
  const languageId = useId();

  const hasActiveFilters = Boolean(value.category || value.university || value.language);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{t('communities.filters.label')}</h2>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="h-7 rounded-full">
            {t('communities.filters.clear')}
          </Button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <label htmlFor={categoryId} className="text-xs font-medium text-muted-foreground">
            {t('communities.filters.category')}
          </label>
          <select
            id={categoryId}
            value={value.category}
            onChange={(event) => onChange({ ...value, category: event.target.value })}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t('communities.filters.allCategories')}</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor={universityId} className="text-xs font-medium text-muted-foreground">
            {t('communities.filters.university')}
          </label>
          <select
            id={universityId}
            value={value.university}
            onChange={(event) => onChange({ ...value, university: event.target.value })}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t('communities.filters.allUniversities')}</option>
            {universityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor={languageId} className="text-xs font-medium text-muted-foreground">
            {t('communities.filters.language')}
          </label>
          <select
            id={languageId}
            value={value.language}
            onChange={(event) => onChange({ ...value, language: event.target.value })}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t('communities.filters.allLanguages')}</option>
            {languageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{t('communities.filters.active')}:</span>
          {value.category ? <Badge variant="secondary">{value.category}</Badge> : null}
          {value.university ? <Badge variant="secondary">{value.university}</Badge> : null}
          {value.language ? <Badge variant="secondary">{value.language}</Badge> : null}
        </div>
      ) : null}
    </div>
  );
}
