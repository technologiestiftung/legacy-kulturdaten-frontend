import { Layouts } from '../components/layouts/AppLayout';
import { Route } from '../lib/routing';

import { Locale } from './locales';

/**
 * All routes present in the app
 */
export enum Routes {
  index = 'index',
  error = 'error',
  dashboard = 'dashboard',
  sitemap = 'sitemap',
  team = 'team',
  login = 'login',
  register = 'register',
  resetPassword = 'resetPassword',
  userProfile = 'userProfile',
  userSettings = 'userSettings',
  userNotifications = 'userNotifications',
  userDeletion = 'userDeletion',
  developer = 'developer',
  organizer = 'organizer',
  createOrganizer = 'createOrganizer',
  offer = 'offer',
  createOffer = 'createOffer',
  location = 'location',
  createLocation = 'createLocation',
  imprint = 'imprint',
  admin = 'admin',
  page404 = 'page404',
}

/**
 * Functions for all valid routes returning relative paths
 */
export const routes: { [key in Routes]: Route } = {
  index: ({ locale }) => `/${localizedRoutes[Routes.index][locale]}`,
  error: ({ locale }) => `/${localizedRoutes[Routes.error][locale]}`,
  dashboard: ({ query, locale }) =>
    `/${query?.organizer}/${localizedRoutes[Routes.dashboard][locale]}/`,
  sitemap: ({ query, locale }) =>
    `/${query?.organizer}/${localizedRoutes[Routes.sitemap][locale]}/`,
  team: ({ query, locale }) => `/${query?.organizer}/${localizedRoutes[Routes.team][locale]}/`,
  userProfile: ({ locale }) => `/${localizedRoutes[Routes.userProfile][locale]}/`,
  userSettings: ({ locale }) => `/${localizedRoutes[Routes.userSettings][locale]}/`,
  userDeletion: ({ locale }) => `/${localizedRoutes[Routes.userDeletion][locale]}/`,
  developer: ({ locale }) => `/${localizedRoutes[Routes.developer][locale]}/`,
  userNotifications: ({ locale }) => `/${localizedRoutes[Routes.userNotifications][locale]}/`,
  login: ({ locale, query }) =>
    `/${localizedRoutes[Routes.login][locale]}/${
      query?.redirect ? `?redirect=${query.redirect}` : ''
    }`,
  register: ({ locale }) => `/${localizedRoutes[Routes.register][locale]}/`,
  resetPassword: ({ locale, query }) =>
    `/${localizedRoutes[Routes.resetPassword][locale]}/${
      query?.email ? `${query.email}?signature=${query.signature}` : ''
    }`,
  organizer: ({ query, locale }) =>
    `/${
      query?.organizer
        ? `${query?.organizer}/${localizedRoutes[Routes.organizer][locale]}/${
            query?.sub ? `${query.sub}/` : ''
          }`
        : ''
    }`,
  createOrganizer: ({ locale }) => `/${localizedRoutes[Routes.createOrganizer][locale]}/`,
  offer: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.offer][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createOffer: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.createOffer][locale]}/`,
  location: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.location][locale]}/${
      query?.id ? `${query?.id}/${query?.sub ? `${query.sub}/` : ''}` : ''
    }`,
  createLocation: ({ query, locale }) =>
    `/${query.organizer}/${localizedRoutes[Routes.createLocation][locale]}/`,
  imprint: ({ locale }) => `/${localizedRoutes[Routes.imprint][locale]}/`,
  admin: ({ locale }) => `/${localizedRoutes[Routes.admin][locale]}/organizers/`,
  page404: ({ query, locale }) =>
    `/${query?.organizer ? `${query.organizer}/` : ''}${
      query?.category ? `${localizedRoutes[query.category as string][locale]}/` : ''
    }${localizedRoutes[Routes.page404][locale]}/`,
};

export const internalRoutes = [
  Routes.dashboard,
  Routes.sitemap,
  Routes.team,
  Routes.userProfile,
  Routes.userNotifications,
  Routes.userSettings,
  Routes.developer,
  Routes.organizer,
  Routes.offer,
  Routes.location,
  Routes.createLocation,
  Routes.createOffer,
  Routes.createOrganizer,
  Routes.admin,
];

/**
 * Localized parts for all routes paths
 */
const localizedRoutes: { [key in Routes]: { [key in Locale]: string } } = {
  index: {
    'de-DE': '',
    'en-DE': '',
  },
  error: {
    'de-DE': 'error',
    'en-DE': 'error',
  },
  dashboard: {
    'de-DE': 'dashboard',
    'en-DE': 'dashboard',
  },
  sitemap: {
    'de-DE': 'sitemap',
    'en-DE': 'sitemap',
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
  userDeletion: {
    'de-DE': 'user/deletion',
    'en-DE': 'user/deletion',
  },
  developer: {
    'de-DE': 'user/developer',
    'en-DE': 'user/developer',
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
  resetPassword: {
    'de-DE': 'auth/resetPassword',
    'en-DE': 'auth/resetPassword',
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
  admin: {
    'de-DE': 'admin',
    'en-DE': 'admin',
  },
  page404: {
    'de-DE': '404',
    'en-DE': '404',
  },
};

export const routesLayouts: { [key in Routes]: Layouts } = {
  index: Layouts.loggedOut,
  error: Layouts.loggedOut,
  createLocation: Layouts.loggedIn,
  createOffer: Layouts.loggedIn,
  createOrganizer: Layouts.loggedIn,
  dashboard: Layouts.loggedIn,
  sitemap: Layouts.loggedIn,
  imprint: undefined,
  location: Layouts.loggedIn,
  login: Layouts.loggedOut,
  offer: Layouts.loggedIn,
  organizer: Layouts.loggedIn,
  register: Layouts.loggedOut,
  resetPassword: Layouts.loggedOut,
  team: Layouts.loggedIn,
  userNotifications: Layouts.loggedInMeta,
  userProfile: Layouts.loggedInMeta,
  userSettings: Layouts.loggedInMeta,
  userDeletion: Layouts.loggedInMeta,
  developer: Layouts.loggedInMeta,
  admin: Layouts.loggedInMeta,
  page404: Layouts.loggedIn,
};
