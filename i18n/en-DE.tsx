/* eslint-disable react/display-name */
import { DashboardTileText, DashboardTileTextP } from '../components/Dasboard/DashboardTile';
import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  test: {
    content: () => 'Test Content',
  },
  dashboard: {
    info: {
      offers: {
        title: () => 'Current Offers',
        link: () => 'View Offer',
        datePlaceholder: () => 'No dates available yet',
      },
      data: {
        title: () => 'Use the data (further)',
        export: {
          title: () => 'Data export',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                You can export all data that you provide on kulturdaten.berlin in standard formats.
              </DashboardTileTextP>
              <DashboardTileTextP>
                To do this, you can use the export function in the corresponding lists or entries.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
        },
        api: {
          title: () => 'API usage for developers',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                Use our API to access the data on all offers and organizers on kulturdaten.berlin or
                to connect you own data to your website.
              </DashboardTileTextP>
              <DashboardTileTextP>
                To use our API you only need to create an API token.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          link: () => 'Create API token',
        },
      },
      linkList: {
        help: {
          title: () => 'Get help',
          text: () =>
            "You have questions or need support in using the platform? We're here to help.",
          links: {
            '1': {
              title: () => 'Support area',
              href: () => 'http://kulturdaten.berlin',
            },
            '2': {
              title: () => 'The project',
              href: () => 'http://kulturdaten.berlin',
            },
          },
        },
        openSource: {
          title: () => 'Get creative',
          text: () =>
            'kulturdaten.berlin is being developed completely open source. Would you like to help? You can find the source code here:',
          links: {
            '1': {
              title: () => 'Interface code on GitHub',
              href: () => 'https://github.com/technologiestiftung/kulturdaten-frontend',
            },
            '2': {
              title: () => 'Server code on GitHub',
              href: () => 'https://github.com/technologiestiftung/kulturdaten-api',
            },
          },
        },
        contact: {
          title: () => 'Contact',
          text: () =>
            'Do you have any questions, suggestions or comments about the this platform? Get in touch at:',
          links: {
            '1': {
              title: () => 'hallo@kulturdaten.berlin',
              href: () => 'mailto:hallo@kulturdaten.berlin',
            },
          },
        },
      },
    },
  },
  language: {
    de: () => 'German',
    en: () => 'English',
  },
  greetings: {
    welcome: () => 'Welcome.',
    hello: () => 'Hello.',
    hey: () => 'Hey.',
    heyhey: () => 'Hey hey.',
  },
  dayPicker: {
    ariaLabel: () => 'Choose',
    minError: ({ min }) => `Please choose at least ${min} ${min === 1 ? 'day' : 'days'}`,
  },
  contacts: {
    add: () => 'Add new contact',
    remove: () => 'remove',
  },
  openingHours: {
    weekday: () => 'Weekday',
    from: () => 'von',
    to: () => 'bis',
    add: () => 'Add new opening hours',
    remove: () => 'remove',
  },
  publish: {
    loadingTitle: ({ categoryName }) => `Publishing ${categoryName}`,
  },
  days: {
    monday: {
      long: () => 'Monday',
      short: () => 'Mo',
    },
    tuesday: {
      long: () => 'Tuesday',
      short: () => 'Tu',
    },
    wednesday: {
      long: () => 'Wednesday',
      short: () => 'We',
    },
    thursday: {
      long: () => 'Thursday',
      short: () => 'Th',
    },
    friday: {
      long: () => 'Friday',
      short: () => 'Fr',
    },
    saturday: {
      long: () => 'Saturday',
      short: () => 'Sa',
    },
    sunday: {
      long: () => 'Sunday',
      short: () => 'Su',
    },
  },
  dateCreate: {
    overlayTitle: ({ offerTitle }) => `Create date for ‘${offerTitle}’`,
    create: () => 'Create date',
    loading: () => 'Creating date',
  },
  accordion: {
    open: () => 'show',
    close: () => 'hide',
  },
  userMenu: {
    loggedIn: () => 'Logged in',
    settings: () => 'Settings',
    logOut: () => 'Log out',
    ariaLabelOpen: () => 'Show user menu',
    ariaLabelClose: () => 'Hide user menu',
  },
  forms: {
    optional: () => 'optional',
    required: () => 'required',
    create: () => 'Create new Organizer',
    baseInfo: () => 'Basic information',
    address: () => 'Address data',
    name: () => 'Name',
    labelGerman: () => 'German',
    labelGermanSimple: () => 'German: simple Language',
    labelEnglish: () => 'English',
    labelEnglishSimple: () => 'English: simple Language',
    description: () => 'Description',
    teaser: () => 'Teaser',
    classification: () => 'Topic category (at least 1 main topic required)',
    type: () => 'Type(s)',
    subjects: () => 'Subject(s)',
    chooseTypeFirst: () => 'Please choose type first',
    tags: () => 'Tags',
    street1: () => 'Street and house number',
    street2: () => 'Additional address',
    zipCode: () => 'Zip code',
    city: () => 'City',
    submit: () => 'create',
    save: () => 'save',
    edit: () => 'edit',
    editCancel: () => 'cancel',
    contact: () => 'Contact data',
    tel: () => 'Phone',
    email: () => 'Email',
    website: () => 'Website',
    links: () => 'Relevant links',
    errors: {
      passwordConfirm: () => 'The entered passwords do not match.',
    },
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
    submit: () => 'login',
    headline: () => 'Log in to kulturdaten.berlin now!',
    loading: () => 'Logging you in',
    error: () => 'The provided login credentials are not valid.',
  },
  logout: {
    loading: () => 'Logging you out',
    loadingMessage: () => 'Bye!',
  },
  register: {
    email: () => 'Email',
    password: () => 'Password',
    confirmPassword: () => 'Confirm password',
    submit: () => 'register',
    headline: () => 'Sign up now! ',
    subline: () => 'Spread your information more convenient via kulturdaten.berlin - for free!',
    loading: () => 'Registering you',
    passwordError: () => 'The entered passwords do not match.',
    requestError: () => "Unfortunately there's a problem with our server. Please try again later.",
    uniqueEmailError: () => 'The entered email is already registered. Please use another email.',
    successHeadline: () => 'Great, that worked!',
    successSubline: () =>
      'We have sent you an email to confirm your registration. Please complete your registration via that email.',
  },
  statusBar: {
    status: () => 'Status',
    draft: () => 'Draft',
    published: () => 'published',
    saved: () => 'Saved',
    savedShort: () => 'Saved',
  },
  save: {
    issues: () => 'There are issues with your inputs.',
    issuesShort: () => 'Input issues',
    invalid: () => 'issues present',
    hint: () => 'There are fields which should be filled.',
    hintShort: () => 'Empty fields',
    confirmExit: () =>
      'There are unsaved changes on this page. When leaving these will be lost. Are you sure you want to leave?',
    alertSymbolAriaLabel: () => 'There are errors in this input fields.',
    infoSymbolAriaLabel: () => 'Here are input fields which should be filled.',
  },
  media: {
    title: () => 'Images',
    copyright: () => 'Author',
    alt: () => 'Alt text',
    license: () => 'License',
    licenseEnd: () => 'End date license',
    imageProcessing: () => 'The image is being processed and loaded',
    openImage: () => 'Open original image in new tab',
    url: () => 'URL',
    format: () => 'Format',
    size: () => 'Size',
    mb: () => 'MB',
    delete: () => 'delete image',
    deleteConfirm: () => 'Do you really want to delete this image? This cannot be undone.',
    maxReached: ({ count }) => `Maximum number of images (${count}) reached.`,
    ariaLabel: () => 'Upload files',
    hint: () =>
      'In order for the image to be publicly available, the mandatory fields must be filled out.',
    dropZoneLabel: () => 'Upload new images',
    usageInfo: () =>
      'Bitte beachte, dass du nur Bilder über kulturdaten.berlin zur Verfügung stellst, die von anderen in unveränderter oder veränderter Form weitergenutzt werden dürfen - auch zu kommerziellen Zwecken und auf Social-Media-Kanälen. Bitte verwende keine Bilder ohne die Zustimmung des/der Rechteinhaber:in. Sind auf den Bildern Personen abgebildet, so müssen diese ihr Einverständnis zur Nutzung des Bildes durch Dritte gegeben haben. Datennutzer:innen - ob Veranstaltungsportal oder App-Entwicklerin - erhalten das Recht, die Bilddateien unter Nennung der Urheber zur Promotion von Angeboten innerhalb der Grenzen des Urheberpersönlichkeitsrechts zu verwenden.',
  },
  logo: {
    title: () => 'Logo',
    imageProcessing: () => 'The logo is being processed and loaded',
    openImage: () => 'Open original logo in new tab',
    delete: () => 'delete logo',
    deleteConfirm: () => 'Do you really want to delete the logo? This cannot be undone.',
    ariaLabel: () => 'Upload logo',
    hint: () =>
      'In order for the logo to be publicly available, the mandatory fields must be filled out.',
    dropZoneLabel: () => 'Upload new logo',
  },
  dropZone: {
    allowedFileTypes: () => 'Allowed file types',
    uploading: ({ progress }) => `Uploading files: ${progress} done`,
    success: ({ count }) => `Successfully uploaded ${count} ${count === 1 ? 'file' : 'files'}`,
    pending: () => `Upload done. Files are being processed.`,
    ariaLabel: () => 'Upload files',
    maxFileSize: () => 'Max allowed file size per upload',
    maxFileSizeExceeded: ({ fileSize, maxFileSize }) =>
      `The selected files are too big for uploading - ${fileSize}, max. ${maxFileSize} allowed. Select less or smaller files.`,
  },
  date: {
    time: () => 'Time',
    from: () => 'From',
    to: () => 'to',
    title: () => 'Additional title',
    titleTooltip: () =>
      "You can add further title information to particular dates of this offer, e.g.  'vernissage ' or  'artist is present'",
    status: () => 'Status',
    info: () => 'Information',
    checkboxAriaLabel: () => 'Select date',
    allCheckboxAriaLabel: () => 'Select all dates',
    details: () => 'Details',
    detailsShowAriaLabel: () => 'Show details',
    detailsHideAriaLabel: () => 'Hide details',
    scheduled: () => 'scheduled',
    scheduledArchived: () => 'scheduled',
    canceled: () => 'canceled',
    past: () => 'past',
    allDay: () => 'is all day',
    clock: () => 'time',
    toDateInvalid: () => 'The date needs to end at a later day that it starts.',
    toTimeInvalid: () => 'The date needs to end at a later time than it starts.',
    titleInfoTitle: () => 'The title of the date will be combined with the title of the offer.',
    roomInfo: () => 'Additional room information',
    roomInfoPlaceholder: () => 'e.g. specific room',
    additionalLinks: () => 'Additional links',
    ticketLink: () => 'Ticket link',
    currentDates: () => 'Current dates',
    archivedDates: () => 'Past dates',
    listPlaceholder: () => 'There are no dates yet.',
    delete: () => 'delete date',
    selectedCount: ({ count }) => `${count} selected`,
    selectedDelete: () => 'delete selected dates',
    sort: {
      startsAt: () => 'Start time',
      endsAt: () => 'End time',
    },
    mode: {
      title: () => 'Offer duration',
      permanent: {
        label: () => 'Permanent offer',
        description1: () =>
          'Offers without a time-limit, e.g. permanent exhibitions, online research database',
        description2: () =>
          'Permanent offers take over the opening times of the assigned location.',
      },
      scheduled: {
        label: () => 'Offer with dates',
        description1: () => 'Time-limited offers, such as: concerts, guided tours, courses',
        description2: () =>
          'Offers with dates can contain any number of individual and series dates, each with individual times.',
      },
    },
    recurrence: {
      title: () => 'Repeat date',
      frequency: () => 'Frequency',
      days: () => 'days',
      weeks: () => 'weeks',
      months: () => 'months',
      never: () => 'never repeat',
      daily: () => 'daily',
      weekly: () => 'weekly',
      monthly: () => 'monthly',
      repeatEvery: () => 'Repeat every',
      onWeekdays: () => 'On weekdays',
      ends: () => 'Ends',
    },
  },
  general: {
    german: () => 'German',
    english: () => 'English',
    deleting: {
      confirm: ({ name }) =>
        `Are you sure, that you want to delete ${name}? This can not be undone.`,
      loading: () => 'Deleting',
      organizer: {
        singular: () => 'this Organizer',
        plural: () => 'these Organizers',
      },
      offer: {
        singular: () => 'this Offer',
        plural: () => 'these Offers',
      },
      location: {
        singular: () => 'this Location',
        plural: () => 'these Locations',
      },
      media: {
        singular: () => 'this image',
        plural: () => 'these images',
      },
      logo: {
        singular: () => 'this logo',
        plural: () => 'these logos',
      },
      date: {
        singular: () => 'this date',
        plural: () => 'these dates',
      },
    },
    name: () => 'name',
    city: () => 'city',
    created: () => 'created',
    updated: () => 'updated',
    create: () => 'create',
    close: () => 'close',
    back: () => 'back',
    choose: () => 'Please choose',
    delete: () => 'delete',
    add: () => 'add',
    type: () => 'Type',
    publish: () => 'publish',
    filter: () => 'Filters',
    sort: () => 'Sort',
    ascending: () => 'ascending',
    descending: () => 'descending',
    ascendingAriaLabel: () => 'Sort list ascending',
    descendingAriaLabel: () => 'Sort list descending',
    show: (props) => `show${props?.name ? ` ${props.name}` : ''}`,
    hide: (props) => `hide${props?.name ? ` ${props.name}` : ''}`,
    expandList: () => 'Expand list view',
    minimizeList: () => 'Minimize list view',
    options: () => 'Options',
    save: () => 'save',
    saving: () => 'saving',
    saved: () => 'saved',
    loading: () => 'loading',
    max: () => 'max.',
    topics: () => 'Keywords (optional)',
    topicsTooltip: () =>
      'With theme tags you can indicate more precisely what your offer is about, e.g. certain types of music or art epochs.\nThese terms are based on the GND (integrated authority file) of the German National Library. If there are any terms missing or some concepts seem out of place, please feel free to contact us at hallo@kulturdaten.berlin!',
    topicsPlaceholder: () => 'Just type away, e.g. Bauhaus',
    takeAFewSeconds: () => 'This can take a few seconds.',
    serverProblem: () =>
      'Unfortunately there is a problem with our server. We are sorry about this. Please try again later.',
  },
  tags: {
    boxLabel: () => 'Already added keywords',
    delete: () => 'delete keyword',
    add: () => 'add keyword',
    placeholder: () => 'No keyword has been added yet',
    autocompleteLabel: () => 'Add new keyword',
    noOptions: () => 'No keywords found',
  },
  tooltip: {
    open: () => 'open tooltip',
    close: () => 'close tooltip',
  },
  linkList: {
    placeholder: () => 'No links added yet',
    inputPlaceholder: () => 'https://example.com',
    addNew: () => 'Add new link',
    maxLinks: ({ amount }) => `maximum of ${amount} links`,
    maxReached: ({ amount }) =>
      `The maximum of ${amount} links is reached. You can not add more links, but you can edit or delete existing links.`,
  },
  richText: {
    history: () => 'History',
    format: () => 'Paragraph format',
    lists: () => 'Lists',
    style: () => 'Text style',
    undo: () => 'Undo change',
    redo: () => 'Redo change',
    paragraph: () => 'Paragraph',
    headingOne: () => 'Headline 1',
    headingTwo: () => 'Headline 2',
    headingThree: () => 'Headline 3',
    listOrdered: () => 'Numbered list',
    listUnordered: () => 'Unordered list',
    bold: () => 'Bold',
    italic: () => 'Italic',
    underline: () => 'Underline',
  },
  overlay: {
    ariaClose: () => 'Close overlay window',
  },
  pagination: {
    next: () => 'next',
    previous: () => 'previous',
    currentPage: ({ currentPage, lastPage }) => `Page ${currentPage} of ${lastPage}`,
  },
  categories: {
    organizer: {
      list: {
        loading: () => 'Loading Organizers',
        nothing: () => 'There are no Organizers yet. Feel free to create one.',
        nothingFilter: () => 'No Organizers found with current filters.',
      },
      filters: {
        status: {
          label: () => 'Status',
          all: () => 'all',
          published: () => 'public',
          draft: () => 'draft',
        },
        type: {
          label: () => 'Type',
          all: () => 'all',
        },
        subject: {
          label: () => 'Subject',
          all: () => 'all',
          typeFirst: () => 'choose type first',
        },
        activeFilters: ({ activeFiltersCount }) => `${activeFiltersCount} active`,
      },
      requirements: {
        label: () => 'Required for publishing',
        name: () => 'Name added',
        description: () => 'Description added',
        categorization: () => 'Categories added',
        address: () => 'Address added',
      },
      title: {
        plural: () => 'Organizers',
        singular: () => 'Organizer',
      },
      form: {
        create: () => 'Create new Organizer',
        baseInfo: () => 'Basic information',
        address: () => 'Address data (not public)',
        submit: () => 'create',
        save: () => 'save',
        edit: () => 'edit',
        editCancel: () => 'cancel',
        contact: () => 'Contact data',
        tel: () => 'Phone',
        email: () => 'Email',
        website: () => 'Website',
        links: () => 'Relevant links',
        additionalContacts: () => 'Additional contacts',
      },
      tabs: {
        info: () => 'Information',
        categorization: () => 'Categorization',
        media: () => 'Images',
      },
      metaLinks: {
        rights: () => 'Access rights',
        export: () => 'Export',
      },
      sort: {
        name: () => 'Name',
        created: () => 'Creation date',
        updated: () => 'Last updated',
      },
      view: {
        label: () => 'View',
        cards: () => 'Cards',
        table: () => 'Table',
      },
      table: {
        created: () => 'created',
        updated: () => 'updated',
      },
    },
    offer: {
      list: {
        loading: () => 'Loading Offers',
        nothing: () => 'There are no Offers yet. Feel free to create one.',
        nothingFilter: () => 'No Offers found with current filters.',
      },
      requirements: {
        name: () => 'Offer title added',
        description: () => 'Description added',
        categorization: () => 'Categories added',
      },
      title: {
        plural: () => 'Offers',
        singular: () => 'Offer',
      },
      form: {
        create: () => 'Create new Offer',
        name: () => 'Offer title',
        nameGerman: () => 'German',
        nameGermanSimple: () => 'German: simple language',
        nameEnglish: () => 'English',
        nameEnglishSimple: () => 'English: simple language',
        description: () => 'Description',
        submit: () => 'create',
        save: () => 'save',
        edit: () => 'edit',
        editCancel: () => 'cancel',
        locationInfo: () => 'Note on the offer location',
        locationInfoPlaceholder: () => 'e.g. specific room',
        mainType: {
          title: () => 'Event type',
          choose: () => 'What kind of offer is it? Poetry Slam, concert, ...',
        },
        pricing: {
          title: () => 'Pricing & admission',
          feeLabel: () => 'Cost',
          registrationLabel: () => 'Admission',
          hasFee: () => 'Ticket required',
          noFee: () => 'No ticket required',
          needsRegistration: () => 'Registration required',
          noRegistration: () => 'No registration required',
          ticketUrl: () => 'Ticket link / ticket information',
          ticketUrlPlaceholder: () => 'https://example.com',
          registrationUrl: () => 'Registration link / registration information',
          registrationUrlPlaceholder: () => 'https://example.com',
        },
        organizer: {
          label: () => 'Organized by',
          choose: () => 'Choose organizer',
          edit: () => 'Change organizer',
          title: ({ name }) => `Choose organizer for ‘${name}’`,
        },
        location: {
          label: () => 'Location',
          choose: () => 'Choose location',
          edit: () => 'Change location',
          title: ({ name }) => `Choose location for ‘${name}’`,
        },
      },
      tabs: {
        info: () => 'Information',
        categorization: () => 'Categorization',
        dates: () => 'Dates',
        accessibility: () => 'Accessibility',
        media: () => 'Images',
      },
    },
    location: {
      list: {
        loading: () => 'Loading Locations',
        nothing: () => 'There are no Locations yet. Feel free to create one.',
        nothingFilter: () => 'No Locations found with current filters.',
      },
      title: {
        plural: () => 'Locations',
        singular: () => 'Location',
      },
      form: {
        openingHours: () => 'Opening hours',
        create: () => 'Create new Location',
        address: () => 'Address data',
        name: () => 'Name',
        nameGerman: () => 'Name German',
        nameGermanSimple: () => 'Name German: simple Language',
        nameEnglish: () => 'Name English',
        nameEnglishSimple: () => 'Name English: simple Language',
        description: () => 'Description',
        teaser: () => 'Teaser',
        street1: () => 'Street and house number',
        street2: () => 'Additional address',
        zipCode: () => 'Zip code',
        city: () => 'City',
        submit: () => 'create',
        save: () => 'save',
        edit: () => 'edit',
        editCancel: () => 'cancel',
        contact: () => 'Contact data',
        tel: () => 'Phone',
        district: () => 'District',
        url: () => 'URL of the Virtual Location',
        rent: {
          title: () => 'Rent',
          url: () => 'Rent link / Rent information',
          urlPlaceholder: () => 'https://example.com',
        },
        type: {
          title: () => 'Type of the Location',
          physicalLabel: () => 'Physical Location',
          physicalText: () => 'A physically existing location with an address, e.g. a building.',
          virtualLabel: () => 'Virtual Location',
          virtualText: () =>
            'A virtually existing location with an URL, e.g. a YouTube or Twitch channel.',
        },
      },
    },
  },
  menu: {
    title: () => 'Kulturdaten.Berlin',
    main: () => 'Main Menu',
    button: {
      open: () => 'open menu',
      close: () => 'close menu',
    },
    start: {
      title: () => 'Start',
      items: {
        dashboard: () => 'Dashboard',
        notifications: () => 'Notifications',
        profile: () => 'Profile',
        team: () => 'Team',
        login: () => 'Login',
        registration: () => 'Registration',
        info: () => 'Info',
      },
    },
    organizer: {
      title: () => 'Organizers',
      items: {
        overview: () => 'Overview',
        create: () => 'create new',
      },
    },
    offer: {
      title: () => 'Offers',
      items: {
        overview: () => 'Overview',
        create: () => 'create new',
      },
    },
    location: {
      title: () => 'Locations',
      items: {
        overview: () => 'Overview',
        create: () => 'create new',
      },
    },
    user: {
      title: () => 'User',
      items: {
        profile: () => 'My Profile',
        settings: () => 'My Settings',
        logout: () => 'logout',
      },
    },
    localeSwitch: {
      label: () => 'Language / Sprache',
      description: () => 'Choose Language, Sprache wählen',
    },
    organizerBandShowAriaLabel: () => 'Show list of my Organizers',
    organizerBandCollapseAriaLabel: () => 'Hide list of my Organizers',
    createOrganizer: () => 'Create new Organizer',
  },
};
