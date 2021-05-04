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
  userSettings = 'userSettings',
  userNotifications = 'userNotifications',
  organizers = 'organizers',
  organizer = 'organizer',
  offers = 'offers',
  offer = 'offer',
  locations = 'locations',
  location = 'location',
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
  userSettings: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${
      localizedRoutes[Routes.userSettings][locale]
    }/`,
  userNotifications: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${
      localizedRoutes[Routes.userNotifications][locale]
    }/`,
  login: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.login][locale]}/`,
  register: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.register][locale]}/`,
  organizers: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.organizers][locale]}/`,
  organizer: ({ query, locale }) => `${routes.organizers({ locale })}${query?.entry}/`,
  offers: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.offers][locale]}/`,
  offer: ({ query, locale }) => `${routes.offers({ locale })}${query?.entry}/`,
  locations: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.locations][locale]}/`,
  location: ({ query, locale }) => `${routes.locations({ locale })}${query?.entry}/`,
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
  userSettings: {
    'de-DE': 'user/settings',
    'en-DE': 'user/settings',
  },
  userNotifications: {
    'de-DE': 'user/notifications',
    'en-DE': 'user/notifications',
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
  offers: {
    'de-DE': 'offers',
    'en-DE': 'offers',
  },
  offer: {
    'de-DE': '',
    'en-DE': '',
  },
  locations: {
    'de-DE': 'locations',
    'en-DE': 'locations',
  },
  location: {
    'de-DE': '',
    'en-DE': '',
  },
  imprint: {
    'de-DE': 'impressum',
    'en-DE': 'imprint',
  },
};
