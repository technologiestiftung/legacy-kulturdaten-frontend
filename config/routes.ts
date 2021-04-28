import { Route } from '../lib/routing';

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

/**
 * All routes present in the app
 */
export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
  providers = 'providers',
  provider = 'provider',
  imprint = 'imprint',
}

/**
 * Functions for all valid routes returning relative paths
 */
export const routes: { [key in Routes]: Route } = {
  index: ({ locale }) => `/${localizedRoutes[Routes.index][locale]}`,
  dashboard: ({ locale }) => `/${localizedRoutes[Routes.dashboard][locale]}/`,
  userProfile: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.userProfile][locale]}/`,
  login: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.login][locale]}/`,
  register: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.register][locale]}/`,
  providers: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.providers][locale]}/`,
  provider: ({ query, locale }) => `${routes.providers({ locale })}${query?.entry}/`,
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}/`,
};

/**
 * Localized parts for all route's paths
 */
const localizedRoutes: { [key in Routes]: { [key in Locale]: string } } = {
  index: {
    'de-DE': '',
    'en-DE': '',
  },
  dashboard: {
    'de-DE': 'app',
    'en-DE': 'app',
  },
  userProfile: {
    'de-DE': 'user/profile',
    'en-DE': 'user/profile',
  },
  login: {
    'de-DE': 'auth/login',
    'en-DE': 'auth/login',
  },
  register: {
    'de-DE': 'auth/register',
    'en-DE': 'auth/register',
  },
  providers: {
    'de-DE': 'providers',
    'en-DE': 'providers',
  },
  provider: {
    'de-DE': '',
    'en-DE': '',
  },
  imprint: {
    'de-DE': 'impressum',
    'en-DE': 'imprint',
  },
};
