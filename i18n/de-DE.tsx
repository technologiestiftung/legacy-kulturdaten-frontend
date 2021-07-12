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
  statusBar: {
    status: () => 'Status',
    draft: () => 'Entwurf',
    published: () => 'öffentlich',
    saved: () => 'Gespeichert',
    savedShort: () => 'Gesp.',
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
    delete: () => 'löschen',
    add: () => 'hinzufügen',
    type: () => 'Typ',
    publish: () => 'veröffentlichen',
    filter: () => 'Filter',
    sort: () => 'Sortierung',
    ascending: () => 'aufsteigend',
    descending: () => 'absteigend',
    ascendingAriaLabel: () => 'Liste aufsteigend sortieren',
    descendingAriaLabel: () => 'Liste absteigend sortieren',
  },
  tooltip: {
    open: () => 'Tooltip anzeigen',
    close: () => 'Tooltip schließen',
  },
  linkList: {
    placeholder: () => 'Noch keine Links hinzugefügt',
    addNew: () => 'Neuen Link hinzufügen',
    maxLinks: ({ amount }) => `maximal ${amount} Links`,
    maxReached: ({ amount }) =>
      `Das Maximum von ${amount} Links ist erreicht. Mehr Links können nicht hinzugefügt werden. Aber bestehende Links können verändert oder gelöscht werden.`,
  },
  richText: {
    history: () => 'Verlauf',
    format: () => 'Absatzformat',
    lists: () => 'Listen',
    style: () => 'Textstil',
    undo: () => 'Änderung rückgängig machen',
    redo: () => 'Änderung wiederherstellen',
    paragraph: () => 'Text',
    headingOne: () => 'Überschrift 1',
    headingTwo: () => 'Überschrift 2',
    headingThree: () => 'Überschrift 3',
    listOrdered: () => 'Nummerierte Liste',
    listUnordered: () => 'Normale Liste',
    bold: () => 'Fett',
    italic: () => 'Kursiv',
    underline: () => 'Unterstrichen',
  },
  overlay: {
    ariaClose: () => 'Überlagerndes Fenster schließen',
  },
  pagination: {
    next: () => 'weiter',
    previous: () => 'zurück',
    currentPage: ({ currentPage, lastPage }) => `Seite ${currentPage} von ${lastPage}`,
  },
  categories: {
    organizer: {
      list: {
        loading: () => 'Lade Anbieter:innen',
        nothing: () => 'Keine Anbieter:innen für die aktive Filterung gefunden',
      },
      filters: {
        status: {
          label: () => 'Status',
          all: () => 'alle',
          published: () => 'öffentlich',
          draft: () => 'Entwurf',
        },
        type: {
          label: () => 'Typ',
          all: () => 'alle',
        },
        subject: {
          label: () => 'Sparte',
          all: () => 'alle',
          typeFirst: () => 'erst Typ auswählen',
        },
        activeFilters: ({ activeFiltersCount }) => `${activeFiltersCount} ausgewählt`,
      },
      requirements: {
        label: () => 'Für Veröffentlichung notwendig',
        name: () => 'Bezeichnung ausgefüllt',
        description: () => 'Beschreibung ausgefüllt',
        categorization: () => 'Kategorisierung ausgefüllt',
        address: () => 'Adresse ausgefüllt',
      },
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
        descriptionExists: () => 'ausgefüllt',
        descriptionExistsNot: () => 'nicht ausgefüllt',
        descriptionGerman: () => 'Deutsch',
        descriptionGermanSimple: () => 'Deutsch: einfache Sprache',
        descriptionEnglish: () => 'Englisch',
        descriptionEnglishSimple: () => 'Englisch: einfache Sprache',
        classification: () => 'Einordnung',
        type: () => 'Typ(en)',
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
        links: () => 'Relevante Links',
      },
      tabs: {
        info: () => 'Informationen',
        categorization: () => 'Kategorisierung',
        media: () => 'Bilder',
        preview: () => 'Vorschau',
      },
      metaLinks: {
        rights: () => 'Zugriffsrechte',
        export: () => 'Export',
      },
      sort: {
        name: () => 'Bezeichnung',
        created: () => 'Erstellungsdatum',
        updated: () => 'Zuletzt geändert',
      },
      view: {
        label: () => 'Darstellung',
        cards: () => 'Karten',
        table: () => 'Tabelle',
      },
      table: {
        created: () => 'erstellt',
        updated: () => 'geändert',
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
    main: () => 'Hauptmenü',
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
        create: () => 'anlegen',
      },
    },
    offer: {
      title: () => 'Angebote',
      items: {
        overview: () => 'Übersicht',
        create: () => 'anlegen',
      },
    },
    location: {
      title: () => 'Orte',
      items: {
        overview: () => 'Übersicht',
        create: () => 'anlegen',
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
