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
  labels: {
    name: () => 'name',
    city: () => 'city',
    created: () => 'created',
    updated: () => 'updated',
  },
  categories: {
    organizer: {
      title: {
        plural: () => 'Organizers',
        singular: () => 'Organizer',
      },
    },
    offer: {
      title: {
        plural: () => 'Offers',
        singular: () => 'Offer',
      },
    },
    location: {
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
    organizer: {
      title: () => 'Organizers',
      items: {
        overview: () => 'Overview',
        create: () => 'Create Organizer',
      },
    },
    offer: {
      title: () => 'Offers',
      items: {
        overview: () => 'Overview',
        create: () => 'Create Offer',
      },
    },
    location: {
      title: () => 'Locations',
      items: {
        overview: () => 'Overview',
        create: () => 'Create Location',
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
