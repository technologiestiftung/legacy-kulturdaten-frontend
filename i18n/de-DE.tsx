/* eslint-disable react/display-name */
import { DashboardTileText, DashboardTileTextP } from '../components/Dasboard/DashboardTile';
import { Localization } from '../lib/i18n';

export const deDE: Localization = {
  test: {
    content: () => 'Test Inhalt',
  },
  dashboard: {
    info: {
      offers: {
        title: () => 'Aktuelle Angebote',
        link: () => 'Angebot anschauen',
      },
      data: {
        title: () => 'Die Kulturdaten (weiter-)verwenden',
        export: {
          title: () => 'Daten Export',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                Alle Daten, die du auf Kulturdaten.Berlin bereitstellst, kannst du auch wieder in
                Standardformaten exportieren.
              </DashboardTileTextP>
              <DashboardTileTextP>
                Dazu kannst du in den entsprechenden Listen oder Einträgen die Export-Funktion
                nutzen.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
        },
        api: {
          title: () => 'API Nutzung für Entwickler:innen',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                Alle Daten, die auf Kulturdaten.Berlin bereitgestellt werden, können frei verwendet
                werden.
              </DashboardTileTextP>
              <DashboardTileTextP>
                Für die programmatische Nutzung benötigst du ein API Token, welches du in deinen
                Einstellungen erstellen kannst.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          link: () => 'Jetzt API Token erstellen',
        },
      },
      linkList: {
        help: {
          title: () => 'Hilfe',
          text: () =>
            'Du benötigst Hilfe oder Erklärungen zu Funktionen der Plattform? Du möchtest mehr über das Projekt Kulturdaten.Berlin lesen? Hier findest du alle Infos:',
          links: {
            '1': {
              title: () => 'Hilfebereich',
              href: () => 'http://kulturdaten.berlin',
            },
            '2': {
              title: () => 'Das Projekt',
              href: () => 'http://kulturdaten.berlin',
            },
          },
        },
        openSource: {
          title: () => 'Open Source',
          text: () =>
            'Kulturdaten.Berlin wird komplett Open Source, also quelloffen, entwickelt. Du möchtest mithelfen? Hier findest du den Quellcode:',
          links: {
            '1': {
              title: () => 'Interface Code auf GitHub',
              href: () => 'https://github.com/technologiestiftung/kulturdaten-frontend',
            },
            '2': {
              title: () => 'Server Code auf GitHub',
              href: () => 'https://github.com/technologiestiftung/kulturdaten-api',
            },
          },
        },
        contact: {
          title: () => 'Kontakt',
          text: () =>
            'Du hast Fragen, Vorschläge oder Anmerkungen zur Kultudatenplattform? Melde dich gerne bei uns unter:',
          links: {
            '1': {
              title: () => 'support@kulturdaten.berlin',
              href: () => 'mailto:support@kulturdaten.berlin',
            },
          },
        },
      },
    },
  },
  language: {
    de: () => 'Deutsch',
    en: () => 'Englisch',
  },
  greetings: {
    welcome: () => 'Willkommen.',
    hello: () => 'Hallo.',
    hey: () => 'Hey.',
    heyhey: () => 'Hey hey.',
  },
  dayPicker: {
    ariaLabel: () => 'Wochentage auswählen',
    minError: ({ min }) => `Bitte min. ${min} ${min === 1 ? 'Tag' : 'Tage'} auswählen`,
  },
  contacts: {
    add: () => 'Neuen Kontakt hinzufügen',
    remove: () => 'entfernen',
  },
  openingHours: {
    weekday: () => 'Wochentag',
    from: () => 'von',
    to: () => 'bis',
    add: () => 'Neue Öffnungszeit hinzufügen',
    remove: () => 'entfernen',
  },
  days: {
    monday: {
      long: () => 'Montag',
      short: () => 'Mo',
    },
    tuesday: {
      long: () => 'Dienstag',
      short: () => 'Di',
    },
    wednesday: {
      long: () => 'Mittwoch',
      short: () => 'Mi',
    },
    thursday: {
      long: () => 'Donnerstag',
      short: () => 'Do',
    },
    friday: {
      long: () => 'Freitag',
      short: () => 'Fr',
    },
    saturday: {
      long: () => 'Samstag',
      short: () => 'Sa',
    },
    sunday: {
      long: () => 'Sonntag',
      short: () => 'So',
    },
  },
  dateCreate: {
    overlayTitle: ({ offerTitle }) => `Termin für ‚${offerTitle}‘ erstellen`,
    create: () => 'Termin erstellen',
    loading: () => ' Erstelle Termin',
  },
  accordion: {
    open: () => 'anzeigen',
    close: () => 'ausblenden',
  },
  userMenu: {
    loggedIn: () => 'Angemeldet',
    settings: () => 'Einstellungen',
    logOut: () => 'Abmelden',
    ariaLabelOpen: () => 'Nutzer:innen Menü anzeigen',
    ariaLabelClose: () => 'Nutzer:innen Menü ausblenden',
  },
  forms: {
    optional: () => 'optional',
    required: () => 'Pflichtfeld',
    create: () => 'Neue Anbieter:in anlegen',
    baseInfo: () => 'Grundlagen',
    address: () => 'Adressdaten',
    name: () => 'Bezeichnung',
    nameGerman: () => 'Bezeichnung Deutsch',
    nameGermanSimple: () => 'Bezeichnung Deutsch: einfache Sprache',
    nameEnglish: () => 'Bezeichnung Englisch',
    nameEnglishSimple: () => 'Bezeichnung Englisch: einfache Sprache',
    description: () => 'Beschreibung',
    descriptionExists: () => 'ausgefüllt',
    descriptionExistsNot: () => 'nicht ausgefüllt',
    descriptionGerman: () => 'Deutsch',
    descriptionGermanSimple: () => 'Deutsch: einfache Sprache',
    descriptionEnglish: () => 'Englisch',
    descriptionEnglishSimple: () => 'Englisch: einfache Sprache',
    classification: () => 'Art und Sparte (min. 1 Art notwendig)',
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
    submit: () => 'einloggen',
    headline: () => 'Logge dich jetzt bei Kulturdaten.Berlin ein.',
    loading: () => 'Anmeldung läuft',
    error: () => 'Die eingegeben Login-Daten sind nicht korrekt.',
  },
  logout: {
    loading: () => 'Abmeldung läuft',
    loadingMessage: () => 'Tschüss!',
  },
  register: {
    email: () => 'E-Mail',
    password: () => 'Passwort',
    confirmPassword: () => 'Passwort bestätigen',
    submit: () => 'registrieren',
    headline: () => 'Registriere dich jetzt kostenlos für Kulturdaten.Berlin.',
    subline: () => 'Die Nutzung bleibt immer kostenlos.',
    passwordError: () => 'Die eingebeben Passwörter stimmen nicht überein.',
    loading: () => 'Deine Registrierung läuft',
    requestError: () =>
      'Es gibt leider ein Problem mit unserem Server. Bitte probiere es später noch einmal.',
    uniqueEmailError: () =>
      'Die angegebene E-Mail ist bereis registriert. Nutze bitte eine andere.',
    successHeadline: () => 'Super, das hat geklappt!',
    successSubline: () =>
      'Wir haben dir eine E-Mail zur Bestätigung deiner Registrierung gesendet. Schließe bitte über diese deine Registrierung ab.',
  },
  statusBar: {
    status: () => 'Status',
    draft: () => 'Entwurf',
    published: () => 'öffentlich',
    saved: () => 'Gespeichert',
    savedShort: () => 'Gesp.',
  },
  save: {
    issues: () => 'Es sind Fehler in den Eingaben vorhanden.',
    issuesShort: () => 'Fehlerhafte Felder',
    invalid: () => 'Fehler vorhanden',
    hint: () => 'Es gibt noch Felder, die ausgefüllt werden sollten.',
    hintShort: () => 'Leere Felder',
    confirmExit: () =>
      'Es gibt ungespeicherte Änderungen auf dieser Seite. Beim Verlassen gehen diese verloren. Willst du die Seite trotzdem verlassen?',
    alertSymbolAriaLabel: () => 'In diesen Eingabefeldern existieren Fehler.',
    infoSymbolAriaLabel: () => 'In diesen Eingabefeldern sollten Eingaben ergänzt werden.',
  },
  media: {
    title: () => 'Bilder',
    copyright: () => 'Urheber:in',
    alt: () => 'Alt Text',
    license: () => 'Lizenz',
    licenseEnd: () => 'Ablaufdatum Lizenz',
    imageProcessing: () => 'Das Bild wird verarbeitet und geladen',
    openImage: () => 'Original Bild in neuem Tab öffnen',
    url: () => 'URL',
    format: () => 'Format',
    size: () => 'Größe',
    mb: () => 'MB',
    delete: () => 'Bild löschen',
    deleteConfirm: () =>
      'Willst du das Bild wirklich löschen? Dies kann nicht rückgängig gemacht werden.',
    maxReached: ({ count }) => `Maximale Anzahl an Bildern (${count}) erreicht.`,
    hint: () =>
      'Damit das Bild öffentlich verfügbar ist, müssen die Pflichtfelder ausgefüllt werden.',
    dropZoneLabel: () => 'Neue Bilder hochladen',
  },
  logo: {
    title: () => 'Logo',
    imageProcessing: () => 'Das Logo wird verarbeitet und geladen',
    openImage: () => 'Original Logo in neuem Tab öffnen',
    delete: () => 'Logo löschen',
    deleteConfirm: () =>
      'Willst du das Logo wirklich löschen? Dies kann nicht rückgängig gemacht werden.',
    hint: () =>
      'Damit das Logo öffentlich verfügbar ist, müssen die Pflichtfelder ausgefüllt werden.',
    dropZoneLabel: () => 'Neues Logo hochladen',
  },
  dropZone: {
    allowedFileTypes: () => 'Erlaubte Dateitypen',
    uploading: ({ progress }) => `Dateien laden hoch: ${progress} geschafft`,
    success: ({ count }) => `Erfolreich ${count} ${count === 1 ? 'Datei' : 'Dateien'} hochgeladen`,
    pending: () => `Hochladen abgeschlossen. Dateien werden verarbeitet.`,
    ariaLabel: () => 'Dateien hochladen',
    maxFileSize: () => 'Maximale Dateigröße pro Upload',
    maxFileSizeExceeded: ({ fileSize, maxFileSize }) =>
      `Die ausgewählten Dateien sind zu groß für den Upload - ${fileSize}, max. ${maxFileSize} erlaubt. Bitte wähle weniger oder kleinere Dateien.`,
  },
  date: {
    from: () => 'von',
    to: () => 'bis',
    time: () => 'Zeit',
    title: () => 'Titel',
    status: () => 'Status',
    info: () => 'Informationen',
    checkboxAriaLabel: () => 'Termin auswählen',
    allCheckboxAriaLabel: () => 'Alle Termine auswählen',
    details: () => 'Details',
    detailsShowAriaLabel: () => 'Details anzeigen',
    detailsHideAriaLabel: () => 'Details ausblenden',
    scheduled: () => 'findet statt',
    scheduledArchived: () => 'fand statt',
    canceled: () => 'abgesagt',
    past: () => 'vergangen',
    allDay: () => 'ist ganztätig',
    clock: () => 'Uhrzeit',
    toDateInvalid: () => 'Das Enddatum muss später als das Startdatum sein.',
    toTimeInvalid: () => 'Die Endzeit muss später als die Startzeit sein.',
    titleInfoTitle: () => 'Der Titel des Termins wird mit dem Titel des Angebots kombiniert.',
    roomInfo: () => 'Rauminformation',
    additionalLinks: () => 'Weiterführende Links',
    ticketLink: () => 'Ticketlink',
    currentDates: () => 'Aktuelle Termine',
    archivedDates: () => 'Vergangene Termine',
    listPlaceholder: () => 'Noch keine Termine vorhanden',
    sort: {
      startsAt: () => 'Startzeit',
      endsAt: () => 'Endzeit',
    },
    mode: {
      title: () => 'Modus des Angebots',
      permanent: {
        label: () => 'Dauerangebot',
        description1: () =>
          'Zeitlich nicht begrenzte Angebote, wie z.B.: Dauerausstellungen, Sammlungen',
        description2: () => 'Dauerangebote übernehmen die Öffnungszeiten des zugewiesenen Ortes.',
      },
      scheduled: {
        label: () => 'Angebot mit Terminen',
        description1: () =>
          'Zeitlich begrenzte Angebote, wie z.B.: Vorstellungen, Konzerte, Filmvorführungen, Kurse',
        description2: () =>
          'Angebote mit Terminen können beliebig viele Einzel- und Serientermine enthalten, mit jeweils individuellen Zeiten.',
      },
    },
    recurrence: {
      title: () => 'Termin wiederholen',
      frequency: () => 'Häufigkeit',
      days: () => 'Tage',
      weeks: () => 'Wochen',
      months: () => 'Monate',
      never: () => 'nie wiederholen',
      daily: () => 'täglich',
      weekly: () => 'wöchentlich',
      monthly: () => 'monatlich',
      repeatEvery: () => 'Wiederholen alle',
      onWeekdays: () => 'An Wochentagen',
      ends: () => 'Endet am',
    },
  },
  general: {
    german: () => 'Deutsch',
    english: () => 'Englisch',
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
    show: (props) => `${props?.name ? `${props.name} ` : ''}anzeigen`,
    hide: (props) => `${props?.name ? `${props.name} ` : ''}ausblenden`,
    expandList: () => 'Listenansicht vergrößern',
    minimizeList: () => 'Listenansicht verkleinern',
    options: () => 'Optionen',
    save: () => 'speichern',
    saving: () => 'speichert',
    saved: () => 'gespeichert',
    loading: () => 'lädt',
    max: () => 'max.',
    topics: () => 'Themen',
    takeAFewSeconds: () => 'Dies kann ein paar Sekunden dauern.',
    serverProblem: () =>
      'Es gibt leider ein Problem mit dem Server. Das tut uns leid. Versuche es bitte später noch einmal.',
  },
  tags: {
    boxLabel: () => 'Bereits hinzugefügte Themen',
    delete: () => 'Thema löschen',
    add: () => 'Thema hinzufügen',
    placeholder: () => 'Noch kein Thema hinzugefügt',
    autocompleteLabel: () => 'Neues Thema hinzufügen',
    noOptions: () => 'Kein passendes Thema gefunden',
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
      `Das Maximum von ${amount} Links ist erreicht. Mehr Links können nicht hinzugefügt werden. Bestehende Links können aber verändert oder gelöscht werden.`,
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
        submit: () => 'anlegen',
        save: () => 'speichern',
        edit: () => 'bearbeiten',
        editCancel: () => 'abbrechen',
        contact: () => 'Kontaktdaten (öffentlich)',
        tel: () => 'Telefon',
        email: () => 'E-Mail',
        website: () => 'Website',
        links: () => 'Relevante Links',
        additionalContacts: () => 'Weitere Kontakte',
      },
      tabs: {
        info: () => 'Informationen',
        categorization: () => 'Kategorisierung',
        media: () => 'Bilder',
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
      list: {
        loading: () => 'Lade Angebote',
        nothing: () => 'Keine Angebote für die aktive Filterung gefunden',
      },
      title: {
        plural: () => 'Angebote',
        singular: () => 'Angebot',
      },
      form: {
        create: () => 'Neues Angebot anlegen',
        name: () => 'Bezeichnung',
        nameGerman: () => 'Bezeichnung Deutsch',
        nameGermanSimple: () => 'Bezeichnung Deutsch: einfache Sprache',
        nameEnglish: () => 'Bezeichnung Englisch',
        nameEnglishSimple: () => 'Bezeichnung Englisch: einfache Sprache',
        description: () => 'Beschreibung',
        descriptionExists: () => 'ausgefüllt',
        descriptionExistsNot: () => 'nicht ausgefüllt',
        descriptionGerman: () => 'Deutsch',
        descriptionGermanSimple: () => 'Deutsch: einfache Sprache',
        descriptionEnglish: () => 'Englisch',
        descriptionEnglishSimple: () => 'Englisch: einfache Sprache',
        submit: () => 'anlegen',
        save: () => 'speichern',
        edit: () => 'bearbeiten',
        editCancel: () => 'abbrechen',
        locationInfo: () => 'Informationen zum Veranstaltungsort',
        pricing: {
          title: () => 'Preise & Eintritt',
          hasFee: () => 'Angebot ist kostenpflichtig',
          needsRegistration: () => 'Angebot ist anmeldepflichtig',
          ticketUrl: () => 'Ticketlink',
        },
        organizer: {
          label: () => 'Angeboten von',
          choose: () => 'Anbieter:in auswählen',
          edit: () => 'Anbieter:in ändern',
          title: ({ name }) => `Anbieter:in für ‚${name}‘ wählen`,
        },
        location: {
          label: () => 'Veranstaltungsort',
          choose: () => 'Ort auswählen',
          edit: () => 'Ort ändern',
          title: ({ name }) => `Ort für ‚${name}‘ wählen`,
        },
      },
      tabs: {
        info: () => 'Informationen',
        categorization: () => 'Kategorisierung',
        dates: () => 'Termine',
        accessibility: () => 'Barrierefreiheit',
        media: () => 'Bilder',
      },
    },
    location: {
      list: {
        loading: () => 'Lade Orte',
        nothing: () => 'Keine Orte für die aktive Filterung gefunden',
      },
      title: {
        plural: () => 'Orte',
        singular: () => 'Ort',
      },
      form: {
        openingHours: () => 'Öffnungszeiten',
        create: () => 'Neuen Ort anlegen',
        address: () => 'Adressdaten',
        name: () => 'Bezeichnung',
        nameGerman: () => 'Bezeichnung Deutsch',
        nameGermanSimple: () => 'Bezeichnung Deutsch: einfache Sprache',
        nameEnglish: () => 'Bezeichnung Englisch',
        nameEnglishSimple: () => 'Bezeichnung Englisch: einfache Sprache',
        description: () => 'Beschreibung',
        descriptionExists: () => 'ausgefüllt',
        descriptionExistsNot: () => 'nicht ausgefüllt',
        descriptionGerman: () => 'Deutsch',
        descriptionGermanSimple: () => 'Deutsch: einfache Sprache',
        descriptionEnglish: () => 'Englisch',
        descriptionEnglishSimple: () => 'Englisch: einfache Sprache',
        street1: () => 'Straße und Hausnummer',
        street2: () => 'Adresszusatz',
        zipCode: () => 'Postleitzahl',
        city: () => 'Stadt',
        submit: () => 'anlegen',
        save: () => 'speichern',
        edit: () => 'bearbeiten',
        editCancel: () => 'abbrechen',
        contact: () => 'Kontaktdaten',
        tel: () => 'Telefon',
        district: () => 'Bezirk',
        url: () => 'URL des virtuellen Ortes',
        type: {
          title: () => 'Typ des Ortes',
          physicalLabel: () => 'Physischer Ort',
          physicalText: () => 'Ein physisch existierender Ort mit Adresse, z.B. ein Gebäude.',
          virtualLabel: () => 'Virtueller Ort',
          virtualText: () => 'Ein virtueller Ort mit URL, z.B. ein YouTube oder Twitch Kanal.',
        },
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
        profile: () => 'Profil',
        team: () => 'Team',
        login: () => 'Login',
        registration: () => 'Registrierung',
        info: () => 'Info',
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
    organizerBandShowAriaLabel: () => 'Liste meiner Anbieter:innen ausklappen',
    organizerBandCollapseAriaLabel: () => 'Liste meiner Anbieter:innen einklappen',
    createOrganizer: () => 'Neue Anbieter:in erstellen',
  },
};
