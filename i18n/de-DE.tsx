import { Localization } from '../lib/i18n';

export const deDE: Localization = {
  test: {
    content: () => 'Test Inhalt',
  },
  start: {
    login: () => 'Login',
    register: () => 'Registrierung',
    dashboard: () => 'App Dashboard',
    imprint: () => 'Impressum',
  },
  login: {
    email: () => 'E-Mail',
    password: () => 'Passwort',
    remember: () => 'Eingeloggt bleiben',
    submit: () => 'Anmelden',
  },
  register: {
    email: () => 'E-Mail',
    password: () => 'Passwort',
    confirmPassword: () => 'Passwort bestätigen',
    submit: () => 'Registrieren',
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
      items: {
        dashboard: () => 'Dashboard',
        notifications: () => 'Benachrichtigungen',
      },
    },
    organizers: {
      title: () => 'Anbieter:innen',
      items: {
        all: () => 'Alle Anbieter:innen',
        my: () => 'Meine Anbieter:innen',
      },
    },
    offers: {
      title: () => 'Angebote',
      items: {
        all: () => 'Alle Angebote',
        my: () => 'Meine Angebote',
      },
    },
    locations: {
      title: () => 'Orte',
      items: {
        all: () => 'Alle Orte',
        my: () => 'Meine Orte',
      },
    },
    user: {
      title: () => 'Nutzer:in',
      items: {
        profile: () => 'Mein Profil',
        settings: () => 'Meine Einstellungen',
        logout: () => 'Abmelden',
      },
    },
    localeSwitch: {
      label: () => 'Sprache / Language',
      description: () => 'Sprache wählen, choose Language',
    },
  },
};
