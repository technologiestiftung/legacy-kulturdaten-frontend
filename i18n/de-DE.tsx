import { Localization } from '../lib/i18n';

export const deDE: Localization = {
  foo: {
    bar: () => 'Spaß',
    coo: ({ x }) => `Wert ${x}`,
  },
  test: {
    content: () => 'Test Inhalt',
  },
  categories: {
    organizers: {
      title: {
        plural: () => 'Anbieter:innen',
        singular: () => 'Anbieter:in',
      },
    },
    offers: {
      title: {
        plural: () => 'Angebote',
        singular: () => 'Angebot',
      },
    },
    locations: {
      title: {
        plural: () => 'Orte',
        singular: () => 'Ort',
      },
    },
  },
  menu: {
    title: () => 'Kulturdaten.Berlin',
    button: {
      open: () => 'Menü öffnen',
      close: () => 'Menü schließen',
    },
    start: {
      title: () => 'Start',
      actions: {
        dashboard: () => 'Dashboard',
        notifications: () => 'Benachrichtigungen',
      },
    },
    organizers: {
      title: () => 'Anbieter:innen',
      actions: {
        all: () => 'Alle Anbieter:innen',
        my: () => 'Meine Anbieter:innen',
      },
    },
    offers: {
      title: () => 'Angebote',
      actions: {
        all: () => 'Alle Angebote',
        my: () => 'Meine Angebote',
      },
    },
    locations: {
      title: () => 'Orte',
      actions: {
        all: () => 'Alle Orte',
        my: () => 'Meine Orte',
      },
    },
    user: {
      title: () => 'Nutzer:in',
      actions: {
        profile: () => 'Mein Profil',
        settings: () => 'Meine Einstellungen',
        logout: () => 'Abmelden',
      },
    },
  },
};
