/**
 * Exposes translation helpers tied to the current locale.
 *
 * Provides a translation function that resolves nested keys with
 * interpolation, and helpers for mapping shared-contract validation
 * messages to the active language without changing the contract.
 */

import { useCallback, useContext } from 'react';
import { I18nContext } from './I18nContext';
import { translations, type Locale } from './translations';

type NestedKey = string;

function getNestedValue(object: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.');
  let current: unknown = object;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function interpolate(template: string, parameters?: Record<string, string | number>): string {
  if (!parameters) {
    return template;
  }

  let result = template;

  for (const [key, value] of Object.entries(parameters)) {
    result = result.split(`{{${key}}}`).join(String(value));
  }

  return result;
}

/**
 * Maps shared-contract Zod English messages to their translated equivalents.
 * Keeps the contract untouched while making validation messages Arabic-ready.
 */
function mapValidationMessageToKey(message: string, locale: Locale): string {
  if (locale === 'en') {
    return message;
  }

  const validationMap: Record<string, string> = {
    'City is required': translations.ar.onboarding.fields.city.required,
    'University is required': translations.ar.onboarding.fields.university.required,
    'Specialization is required': translations.ar.onboarding.fields.specialization.required,
    'Arrival stage is required': translations.ar.onboarding.fields.arrivalStage.required,
    'Turkish level is required': translations.ar.onboarding.fields.turkishLevel.required,
  };

  return validationMap[message] ?? message;
}

export function useTranslation() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  const { locale, direction, setLocale, toggleLocale } = context;

  const translate = useCallback(
    (key: NestedKey, parameters?: Record<string, string | number>): string => {
      const localeMessages = translations[locale] as unknown as Record<string, unknown>;
      const fallbackMessages = translations.en as unknown as Record<string, unknown>;

      const localeValue = getNestedValue(localeMessages, key);
      const fallbackValue = getNestedValue(fallbackMessages, key);

      const template = typeof localeValue === 'string' ? localeValue : typeof fallbackValue === 'string' ? fallbackValue : key;

      return interpolate(template, parameters);
    },
    [locale],
  );

  const translateError = useCallback(
    (message: string | undefined): string | undefined => {
      if (!message) {
        return undefined;
      }

      return mapValidationMessageToKey(message, locale);
    },
    [locale],
  );

  return {
    t: translate,
    translateError,
    locale,
    direction,
    setLocale,
    toggleLocale,
    isRtl: direction === 'rtl',
  };
}
