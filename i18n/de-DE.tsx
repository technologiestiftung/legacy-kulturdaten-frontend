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
  general: {
    name: () => 'Bezeichnung',
    city: () => 'Stadt',
    created: () => 'erstellt',
    updated: () => 'geändert',
    create: () => 'erstelle',
  },
  categories: {
    organizer: {
      title: {
        plural: () => 'Anbieter:innen',
        singular: () => 'Anbieter:in',
      },
    },
    offer: {
      title: {
        plural: () => 'Angebote',
        singular: () => 'Angebot',
      },
    },
    location: {
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
    organizer: {
      title: () => 'Anbieter:innen',
      items: {
        overview: () => 'Übersicht',
        create: () => 'Erstelle Anbieter:in',
      },
    },
    offer: {
      title: () => 'Angebote',
      items: {
        overview: () => 'Übersicht',
        create: () => 'Erstelle Angebot',
      },
    },
    location: {
      title: () => 'Orte',
      items: {
        overview: () => 'Übersicht',
        create: () => 'Erstelle Ort',
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
