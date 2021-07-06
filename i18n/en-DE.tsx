import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  test: {
    content: () => 'Test Content',
  },
  accordion: {
    open: () => 'show',
    close: () => 'hide',
  },
  forms: {
    required: () => 'required',
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
    submit: () => 'Login',
  },
  register: {
    email: () => 'Email',
    password: () => 'Password',
    confirmPassword: () => 'Confirm password',
    submit: () => 'Register',
  },
  statusBar: {
    status: () => 'State',
    draft: () => 'Draft',
    published: () => 'published',
    saved: () => 'Saved',
    savedShort: () => 'Saved',
  },
  general: {
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
  },
  tooltip: {
    open: () => 'open tooltip',
    close: () => 'close tooltip',
  },
  linkList: {
    placeholder: () => 'No links added yet',
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
      filters: {
        status: {
          label: () => 'Status',
          all: () => 'all',
          published: () => 'public',
          draft: () => 'draft',
        },
      },
      requirements: {
        label: () => 'Required for publishing',
        name: () => 'Name added',
        description: () => 'Description added',
        categorization: () => 'Type(s) and subject(s) chosen',
        address: () => 'Address added',
      },
      title: {
        plural: () => 'Organizers',
        singular: () => 'Organizer',
      },
      form: {
        create: () => 'Create new organizer',
        baseInfo: () => 'Basic information',
        address: () => 'Address data (not public)',
        name: () => 'Name',
        nameGerman: () => 'Name German',
        nameGermanSimple: () => 'Name German: simple Language',
        nameEnglish: () => 'Name English',
        nameEnglishSimple: () => 'Name English: simple Language',
        description: () => 'Description',
        descriptionExists: () => 'filled out',
        descriptionExistsNot: () => 'not filled out',
        descriptionGerman: () => 'German',
        descriptionGermanSimple: () => 'German: simple Language',
        descriptionEnglish: () => 'English',
        descriptionEnglishSimple: () => 'English: simple Language',
        classification: () => 'Classification',
        type: () => 'Type',
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
        contact: () => 'Contact data (public)',
        tel: () => 'Phone',
        email: () => 'Email',
        website: () => 'Website',
        links: () => 'Relevant links',
      },
      tabs: {
        info: () => 'Information',
        categorization: () => 'Categorization',
        media: () => 'Images',
        preview: () => 'Preview',
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
  },
};
