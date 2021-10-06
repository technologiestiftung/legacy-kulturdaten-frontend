import { Layouts } from '../components/layouts/AppLayout';
import { Route } from '../lib/routing';

import { Locale } from './locales';

/**
 * All routes present in the app
 */
export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  team = 'team',
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
  dashboard: ({ query, locale }) =>
    `/app/${query?.organizer}/${localizedRoutes[Routes.dashboard][locale]}/`,
  team: ({ query, locale }) => `/app/${query?.organizer}/${localizedRoutes[Routes.team][locale]}/`,
  userProfile: ({ locale }) => `/app/${localizedRoutes[Routes.userProfile][locale]}/`,
  userSettings: ({ locale }) => `/app/${localizedRoutes[Routes.userSettings][locale]}/`,
  userNotifications: ({ locale }) => `/app/${localizedRoutes[Routes.userNotifications][locale]}/`,
  login: ({ locale }) => `/app/${localizedRoutes[Routes.login][locale]}/`,
  register: ({ locale }) => `/app/${localizedRoutes[Routes.register][locale]}/`,
  organizer: ({ query, locale }) =>
    `/app/${
      query?.organizer
        ? `${query?.organizer}/${localizedRoutes[Routes.organizer][locale]}/${
            query?.sub ? `${query.sub}/` : ''
          }`
        : ''
    }`,
  createOrganizer: ({ locale }) => `/app/${localizedRoutes[Routes.createOrganizer][locale]}/`,
  offer: ({ query, locale }) =>
    `/app/${query.organizer}/${localizedRoutes[Routes.offer][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createOffer: ({ query, locale }) =>
    `/app/${query.organizer}/${localizedRoutes[Routes.createOffer][locale]}/`,
  location: ({ query, locale }) =>
    `/app/${query.organizer}/${localizedRoutes[Routes.location][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createLocation: ({ query, locale }) =>
    `/app/${query.organizer}/${localizedRoutes[Routes.createLocation][locale]}/`,
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}/`,
};

export const internalRoutes = [
  Routes.dashboard,
  Routes.team,
  Routes.userProfile,
  Routes.userNotifications,
  Routes.userSettings,
  Routes.organizer,
  Routes.offer,
  Routes.location,
  Routes.createLocation,
  Routes.createOffer,
  Routes.createOrganizer,
];

/**
 * Localized parts for all routes paths
 */
const localizedRoutes: { [key in Routes]: { [key in Locale]: string } } = {
  index: {
    'de-DE': '',
    'en-DE': '',
  },
  dashboard: {
    'de-DE': 'dashboard',
    'en-DE': 'dashboard',
  },
  team: {
    'de-DE': 'team',
    'en-DE': 'team',
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
    'de-DE': 'profile',
    'en-DE': 'profile',
  },
  createOrganizer: {
    'de-DE': 'create-organizer',
    'en-DE': 'create-organizer',
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

export const routesLayouts: { [key in Routes]: Layouts } = {
  index: Layouts.loggedOut,
  createLocation: Layouts.loggedIn,
  createOffer: Layouts.loggedIn,
  createOrganizer: Layouts.loggedIn,
  dashboard: Layouts.loggedIn,
  imprint: undefined,
  location: Layouts.loggedIn,
  login: Layouts.loggedOut,
  offer: Layouts.loggedIn,
  organizer: Layouts.loggedIn,
  register: Layouts.loggedOut,
  team: Layouts.loggedIn,
  userNotifications: Layouts.loggedIn,
  userProfile: Layouts.loggedIn,
  userSettings: Layouts.loggedIn,
};
