import { DateFormat } from '../lib/date';

/**
 * All locales used in the app
 */
export enum Locale {
  'de-DE' = 'de-DE',
  'en-DE' = 'en-DE',
}

export const locales: {
  [key in Locale]: {
    name: string;
  };
} = {
  'de-DE': {
    name: 'Deutsch',
  },
  'en-DE': {
    name: 'English',
  },
};

export const dateFormatPatternMap: { [key in DateFormat]: { [key in Locale]: string } } = {
  date: {
    'de-DE': 'dd.MM.yyyy',
    'en-DE': 'MM-dd-yyyy',
  },
  time: {
    'de-DE': 'hh:mm',
    'en-DE': 'hh:mm aaa',
  },
  dateTime: {
    'de-DE': 'dd.MM.yyyy HH:mm',
    'en-DE': 'MM-dd-yyyy hh:mm aaa',
  },
};
