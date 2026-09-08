/**
 * Defines the i18n context type and instance for locale handling.
 */

import { createContext } from 'react';
import type { Locale } from './translations';

export interface I18nContextValue {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
