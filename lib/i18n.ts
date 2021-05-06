import { ReactElement, useCallback, useMemo } from 'react';

import { Locale } from '../config/locales';
import { useLocale } from './routing';
import localizations from '../i18n';

type LocalizationParams = { [key: string]: string | number | boolean };

type localizationFunction = (params: LocalizationParams) => string | ReactElement;

export type Localization = {
  [key: string]: localizationFunction | Localization;
};

/**
 * Used to access localized contents.
 * @param locale - The requested Locale
 * @param key - The key in dot-notation (key.to.nested.entry) to the entry
 * @param params - Optional parameters need by the entry
 * @returns A string or rendered ReactElement
 */
const t = (locale: Locale, key: string, params?: LocalizationParams): string | ReactElement => {
  const localization = localizations[locale];

  const entry = key.split('.').reduce<localizationFunction | Localization>((before, currentKey) => {
    if (typeof before === 'object') {
      const foundEntry = Object.getOwnPropertyDescriptor(before, currentKey)?.value;
      if (foundEntry) {
        return foundEntry;
      } else {
        throw Error(`No entry found for key: '${key}'`);
      }
    } else {
      return before;
    }
  }, localization);

  if (typeof entry === 'function') {
    return entry(params);
  }

  throw new Error(`Key '${key}' points to object`);
};

/**
 * Hook to use t function, without manually injecting the Locale
 * @returns The t function with already injected current Locale
 */
export const useT = (): ((key: string, params?: LocalizationParams) => string | ReactElement) => {
  const locale = useLocale();

  const correctedLocale = useMemo(
    () =>
      typeof locale === 'undefined' || locale === ('catchAll' as Locale) ? Locale['de-DE'] : locale,
    [locale]
  );

  const tCallback = useCallback((key, params) => t(correctedLocale, key, params), [
    correctedLocale,
  ]);

  if (correctedLocale) {
    return tCallback;
  }

  return () => undefined;
};
