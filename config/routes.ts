import { Route } from '../lib/routing';

export enum Locale {
  'de-DE' = 'de-DE',
  'en-DE' = 'en-DE',
}

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
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}`,
};

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
