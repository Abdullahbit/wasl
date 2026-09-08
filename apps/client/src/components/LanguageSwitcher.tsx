/**
 * Renders the language switcher that toggles between English and Arabic.
 *
 * The switcher is visible on all pages, persists the choice, and updates
 * html dir/lang so the entire app reflows correctly.
 */

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-full border bg-background p-1" role="group" aria-label={t('common.language')}>
      <Button
        type="button"
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          if (locale !== 'en') toggleLocale();
        }}
        aria-pressed={locale === 'en'}
        className="h-7 rounded-full px-3 text-xs"
      >
        EN
      </Button>
      <Button
        type="button"
        variant={locale === 'ar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          if (locale !== 'ar') toggleLocale();
        }}
        aria-pressed={locale === 'ar'}
        className="h-7 rounded-full px-3 text-xs"
      >
        AR
      </Button>
    </div>
  );
}
