/**
 * Provides locale state, persistence, and HTML direction handling for the app.
 *
 * The provider stores the chosen locale in localStorage, updates html
 * lang and dir attributes, and exposes the current locale through context.
 * This keeps all i18n concerns outside individual components.
 */

import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { I18nContext, type I18nContextValue } from './I18nContext';
import { translations, type Locale } from './translations';

const STORAGE_KEY = 'wasl-locale';
const DEFAULT_LOCALE: Locale = 'en';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY);

  if (storedLocale === 'en' || storedLocale === 'ar') {
    return storedLocale;
  }

  return DEFAULT_LOCALE;
}

function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());
  const direction = getDirection(locale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((currentLocale) => (currentLocale === 'en' ? 'ar' : 'en'));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  const contextValue = useMemo<I18nContextValue>(() => {
    return {
      locale,
      direction,
      setLocale,
      toggleLocale,
    };
  }, [locale, direction, setLocale, toggleLocale]);

  // Also keep translations import alive for potential preload
  void translations;

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
