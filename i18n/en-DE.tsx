import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  test: {
    content: () => 'Test Content',
  },
  start: {
    login: () => 'Login',
    register: () => 'Register',
    dashboard: () => 'App Dashboard',
    imprint: () => 'Imprint',
  },
  login: {
    email: () => 'Email',
    password: () => 'Password',
    remember: () => 'Stay logged in',
    submit: () => 'Login',
  },
  register: {
    email: () => 'Email',
    password: () => 'Password',
    confirmPassword: () => 'Confirm password',
    submit: () => 'Register',
  },
  categories: {
    organizers: {
      title: {
        plural: () => 'Organizers',
        singular: () => 'Organizer',
      },
    },
    offers: {
      title: {
        plural: () => 'Offers',
        singular: () => 'Offer',
      },
    },
    locations: {
      title: {
        plural: () => 'Locations',
        singular: () => 'Location',
      },
    },
  },
  menu: {
    title: () => 'Kulturdaten.Berlin',
    button: {
      open: () => 'open menu',
      close: () => 'close menu',
    },
    start: {
      title: () => 'Start',
      items: {
        dashboard: () => 'Dashboard',
        notifications: () => 'Notifications',
      },
    },
    organizers: {
      title: () => 'Organizers',
      items: {
        all: () => 'All Organizers',
        my: () => 'My Organizers',
      },
    },
    offers: {
      title: () => 'Offers',
      items: {
        all: () => 'All Offers',
        my: () => 'My Offers',
      },
    },
    locations: {
      title: () => 'Locations',
      items: {
        all: () => 'All Locations',
        my: () => 'My Locations',
      },
    },
    user: {
      title: () => 'User',
      items: {
        profile: () => 'My Profile',
        settings: () => 'My Settings',
        logout: () => 'Logout',
      },
    },
    localeSwitch: {
      label: () => 'Language / Sprache',
      description: () => 'Choose Language, Sprache wählen',
    },
  },
};
