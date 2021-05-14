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
  organizer = 'organizer',
  createOrganizer = 'createOrganizer',
  offer = 'offer',
  createOffer = 'createOffer',
  location = 'location',
  createLocation = 'createLocation',
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
  organizer: ({ query, locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.organizer][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createOrganizer: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${
      localizedRoutes[Routes.createOrganizer][locale]
    }/`,
  offer: ({ query, locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.offer][locale]}/${
      query?.id ? `${query?.id}/` : ''
    }`,
  createOffer: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.createOffer][locale]}/`,
  location: ({ query, locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${localizedRoutes[Routes.location][locale]}/${
      query?.id ? `${query?.id}/` : ''
    }`,
  createLocation: ({ locale }) =>
    `/${localizedRoutes[Routes.dashboard][locale]}/${
      localizedRoutes[Routes.createLocation][locale]
    }/`,
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}/`,
};

/**
 * Localized parts for all routes paths
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
  organizer: {
    'de-DE': 'organizer',
    'en-DE': 'organizer',
  },
  createOrganizer: {
    'de-DE': 'organizer/create',
    'en-DE': 'organizer/create',
  },
  offer: {
    'de-DE': 'offer',
    'en-DE': 'offer',
  },
  createOffer: {
    'de-DE': 'offer/create',
    'en-DE': 'offer/create',
  },
  location: {
    'de-DE': 'location',
    'en-DE': 'location',
  },
  createLocation: {
    'de-DE': 'location/create',
    'en-DE': 'location/create',
  },
  imprint: {
    'de-DE': 'impressum',
    'en-DE': 'imprint',
  },
};
