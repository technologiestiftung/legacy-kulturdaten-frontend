import { Localization } from '../lib/i18n';

export const deDE: Localization = {
  test: {
    content: () => 'Test Inhalt',
  },
  accordion: {
    open: () => 'anzeigen',
    close: () => 'ausblenden',
  },
  forms: {
    required: () => 'Pflichtfeld',
    errors: {
      passwordConfirm: () => 'Die eingegebenen Passwörter stimmen nicht überein.',
    },
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
    close: () => 'schließen',
    back: () => 'zurück',
    choose: () => 'Bitte auswählen',
    status: () => 'Status',
    draft: () => 'Entwurf',
    published: () => 'veröffentlicht',
    lastUpdated: () => 'Zuletzt aktualisiert',
  },
  overlay: {
    ariaClose: () => 'Überlagerndes Fenster schließen',
  },
  categories: {
    organizer: {
      title: {
        plural: () => 'Anbieter:innen',
        singular: () => 'Anbieter:in',
      },
      form: {
        create: () => 'Neue Anbieter:in anlegen',
        baseInfo: () => 'Grundlagen',
        address: () => 'Adressdaten (nicht öffentlich)',
        name: () => 'Bezeichnung',
        nameGerman: () => 'Bezeichnung deutsch',
        nameGermanSimple: () => 'Bezeichnung deutsch: einfache Sprache',
        nameEnglish: () => 'Bezeichnung englisch',
        nameEnglishSimple: () => 'Bezeichnung englisch: einfache Sprache',
        description: () => 'Beschreibung',
        descriptionGerman: () => 'Beschreibung deutsch',
        descriptionGermanSimple: () => 'Beschreibung deutsch: einfache Sprache',
        descriptionEnglish: () => 'Beschreibung englisch',
        descriptionEnglishSimple: () => 'Beschreibung englisch: einfache Sprache',
        classification: () => 'Einordnung',
        type: () => 'Typ',
        subjects: () => 'Sparte(n)',
        chooseTypeFirst: () => 'Bitte zunächst Typ auswählen',
        tags: () => 'Tags',
        street1: () => 'Straße und Hausnummer',
        street2: () => 'Adresszusatz',
        zipCode: () => 'Postleitzahl',
        city: () => 'Stadt',
        submit: () => 'anlegen',
        save: () => 'speichern',
        edit: () => 'bearbeiten',
        editCancel: () => 'abbrechen',
        contact: () => 'Kontaktdaten (öffentlich)',
        tel: () => 'Telefon',
        email: () => 'E-Mail',
        website: () => 'Website',
        social: () => 'Social Media Links',
      },
      tabs: {
        overview: () => 'Übersicht',
        info: () => 'Informationen',
        rights: () => 'Zugriffsrechte',
        export: () => 'Export',
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
        create: () => 'Anbieter:in anlegen',
      },
    },
    offer: {
      title: () => 'Angebote',
      items: {
        overview: () => 'Übersicht',
        create: () => 'Angebot anlegen',
      },
    },
    location: {
      title: () => 'Orte',
      items: {
        overview: () => 'Übersicht',
        create: () => 'Ort anlegen',
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
