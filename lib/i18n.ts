import { ReactElement } from 'react';

import { Locale } from '../config/routes';
import { useLocale } from './routing';

type LocalizationParams = { [key: string]: string | number | boolean };

type localizationFunction = (params: LocalizationParams) => string | ReactElement;

type Localization = {
  [key: string]: localizationFunction | Localization;
};

const localizations: { [key in Locale]: Localization } = {
  'de-DE': {
    foo: {
      bar: () => 'Spaß',
      coo: ({ x }) => `Wert ${x}`,
    },
  },
  'en-DE': {
    foo: {
      bar: () => 'fun',
      coo: ({ x }) => `Value ${x}`,
    },
  },
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

  const found = key.split('.').reduce<localizationFunction | Localization>((before, currentKey) => {
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

  if (typeof found === 'function') {
    return found(params);
  }
  throw new Error(`Key '${key}' points to object`);
};

/**
 * Hook to use t function, without manually injecting the Locale
 * @returns The t function with already injected current Locale
 */
export const useT = (): ((key: string, params?: LocalizationParams) => string | ReactElement) => {
  const locale = useLocale();

  if (locale) {
    return (key, params) => t(locale, key, params);
  }

  return () => undefined;
};
