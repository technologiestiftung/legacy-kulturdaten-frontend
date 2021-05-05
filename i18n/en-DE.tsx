import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  foo: {
    bar: () => 'fun',
    coo: ({ x }) => `Value ${x}`,
  },
  menu: {
    title: () => 'Kulturdaten.Berlin',
    button: {
      open: () => 'open menu',
      close: () => 'close menu',
    },
    start: {
      title: () => 'Start',
      actions: {
        dashboard: () => 'Dashboard',
        notifications: () => 'Notifications',
      },
    },
    organizers: {
      title: () => 'Organizers',
      actions: {
        all: () => 'All Organizers',
        my: () => 'My Organizers',
      },
    },
    offers: {
      title: () => 'Offers',
      actions: {
        all: () => 'All Offers',
        my: () => 'My Offers',
      },
    },
    locations: {
      title: () => 'Locations',
      actions: {
        all: () => 'All Locations',
        my: () => 'My Locations',
      },
    },
    user: {
      title: () => 'User',
      actions: {
        profile: () => 'My Profile',
        settings: () => 'My Settings',
        logout: () => 'Logout',
      },
    },
  },
};
