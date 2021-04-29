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
