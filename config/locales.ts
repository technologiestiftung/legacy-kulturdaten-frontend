import { DateFormat } from '../lib/date';
import { Language, Locale } from './locale';

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

export const languages: {
  [key in Language]: {
    name: string;
  };
} = {
  de: {
    name: 'Deutsch',
  },
  en: {
    name: 'English',
  },
};

export const contentLanguages = Object.values(Language);
export const languageTranslationKeys: { [key in Language]: string } = {
  de: 'language.de',
  en: 'language.en',
};

export const localeLanguageMap: { [key in Locale]: Language } = {
  'de-DE': Language.de,
  'en-DE': Language.en,
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
  dayDateTime: {
    'de-DE': 'dd.MM.yyyy HH:mm',
    'en-DE': 'MM-dd-yyyy hh:mm aaa',
  },
};

export { Language, Locale };
