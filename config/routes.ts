import { Route } from '../lib/routing';

import { Locale } from './locales';

/**
 * All routes present in the app
 */
export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
  organizers = 'organizers',
  organizer = 'organizer',
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
  organizers: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.organizers][locale]}/`,
  organizer: ({ query, locale }) => `${routes.organizers({ locale })}${query?.entry}/`,
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
  organizers: {
    'de-DE': 'organizers',
    'en-DE': 'organizers',
  },
  organizer: {
    'de-DE': '',
    'en-DE': '',
  },
  imprint: {
    'de-DE': 'impressum',
    'en-DE': 'imprint',
  },
};
