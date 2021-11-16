/* eslint-disable react/display-name */
import { DashboardTileText, DashboardTileTextP } from '../components/Dasboard/DashboardTile';
import { InfoLi, InfoP, InfoUl } from '../components/info';
import { StatusFlag, StatusFlagVariant } from '../components/Status/StatusFlag';
import { TooltipP } from '../components/tooltip/TooltipContent';
import { PublishedStatus } from '../lib/api/types/general';
import { Localization } from '../lib/i18n';

export const enDE: Localization = {
  test: {
    content: () => 'Test Content',
  },
  admin: {
    title: () => 'Administration',
    organizers: {
      subtitle: () => 'Organizers',
    },
    start: () => 'Start admin mode',
    quit: () => 'Quit admin mode',
    leave: () => 'Quit admin mode',
  },
  dashboard: {
    info: {
      hint: {
        title: ({ name }) => `Publish “${name}”`,
        content: () => (
          <DashboardTileText>
            <DashboardTileTextP>
              Your profile is not yet public. Publish it so your dates, offers, and places are
              publicly available.
            </DashboardTileTextP>
          </DashboardTileText>
        ),
        link: () => `Edit and publish profile`,
      },
      start: {
        title: () => 'How to get started',
        organizer: {
          title: () => 'Create an organizer profile',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                You want to publish data about a cultural institution, your collective or yourself
                as a solo artist? Create an organizer profile to describe yourself and link
                locations and offers to this profile.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          button: () => 'Create profile',
          done: () => 'Profile has been created',
        },
        offer: {
          title: () => 'Create an offer',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                Whether performance or dance class, online collection or research service - here you
                can describe your cultural offer in all its diversity.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          button: () => 'Create offer',
          done: () => 'Offer has been created',
        },
        location: {
          title: () => 'Create a location',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                No more copy-pasting addresses! Enter information about your venue only once and
                then use it again and again for your offers. You can create as many venues as you
                like - or even individual rooms.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          button: () => 'Create location',
          done: () => 'Location has been created',
        },
      },
      organizer: {
        title: () => 'Get your organizer up and running',
        team: {
          title: () => 'Invite team members',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                On the team page, you can give other registered users access to your entries. Once
                invited, they can view and edit the organizer&apos;s data and create offers and
                locations for them.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          link: () => 'Manage your team',
        },
        profile: {
          title: () => 'Fill out the profile',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                The more information you enter in your Organizer{"'"}s profile, the more meaningful
                and easy to find your data.
              </DashboardTileTextP>
              <DashboardTileTextP>
                On the Profile page you can enter general information, categorize your Organizer and
                upload pictures.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
          link: () => 'Fill out the profile',
        },
      },
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
                All the data you provide can be exported ageain in standard formats using the
                corresponding buttons.
              </DashboardTileTextP>
            </DashboardTileText>
          ),
        },
        api: {
          title: () => 'API usage for developers',
          content: () => (
            <DashboardTileText>
              <DashboardTileTextP>
                Use our API to access the data on all offers, locations and organizers on
                kulturdaten.berlin or to connect you own data to your website.
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
  languageTags: {
    addButton: () => 'Add language',
    addLabel: () => 'Add new languages',
    addPlaceholder: () => 'Just type away, e.g. English',
    listDelete: () => 'Remove language',
    listLabel: () => 'Already added languages',
    listPlaceholder: () => 'No language has been added yet',
    noMatch: () => 'No languages found',
  },
  team: {
    list: {
      title: () => 'Team members',
      email: () => 'Email',
      role: () => 'Role',
      pending: () => 'Invite pending',
      info: () =>
        "There always needs to be at least one Owner. There can be more though. If you don't want to be Owner anymore, you can assign the Owner role to someone else and assign yourself a different role.",
    },
    roles: {
      owner: () => 'Owner',
      editor: () => 'Editor',
    },
    invite: {
      label: () => 'Emails of new members you want to invite',
      title: () => 'Invite new team members',
      loading: () => 'Inviting new team members',
      button: () => 'Invite',
      pending: () => 'Invite pending',
      hint: ({ max }) =>
        `You can add a single email, or a list of emails (max. ${max}) separated with "," (comma).`,
      hint2: () => 'Example: name@example.com, title@another-example.com',
      placeholder: () => 'name@example.com, title@another-example.com',
      invalid: () =>
        'Your entered data is invalid. Please check that it follows the structure "name@example.com, title@another-example.com".',
    },
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
    add: () => 'Add contact',
    remove: () => 'remove',
    placeholder: () => 'No contacts added yet',
  },
  hours: {
    weekday: () => 'Weekday',
    from: () => 'von',
    to: () => 'bis',
    add: () => 'Add new hours',
    remove: () => 'remove',
    note: () => 'Note on hours',
  },
  openingHours: {
    add: () => 'Add new opening hours',
  },
  peakHours: {
    add: () => 'Add new peak hours',
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
    admin: () => 'Administration',
  },
  settings: {
    title: () => 'Settings',
    loading: () => 'Generating API token',
    personal: {
      title: () => 'Personal data',
      tooltip: () =>
        'Your name is only used internally on kulturdaten.berlin and is not publicly visible. Only your common team members will be able to see it when you jointly enter the data of your organizer.',
      firstname: () => 'First name',
      lastname: () => 'Last name',
    },
    api: {
      titleCreate: () => 'Create API token (for developers)',
      titleCreateTooltip: () =>
        'You want to use our API? Tell us about your project and please enter the website URL or project name.',
      projectTitle: () => 'Name of your application',
      projectTitlePlaceholder: () => 'A descriptive name',
      projectUrl: () => 'URL of your application',
      projectDescription: () => 'Project description',
      projectDescriptionPlaceholder: () =>
        'e.g. smartphone app for context-related use of cultural data',
      titleList: () => 'Your existing API tokens',
      tokenTitle: () => 'Token',
      tokenName: () => 'Project name',
      tokenUrl: () => 'Url',
      createButton: () => 'create API token',
      info: () => (
        <>
          This is a function for developers. To use the kulturdaten.berlin API, you need an API
          token. Requests made with this token are connected to your user account. To find out how
          you can use the token to get data via the API, please read our{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://beta.api.kulturdaten-berlin.anyvent.cloud/docs/"
          >
            API docs.
          </a>
        </>
      ),
    },
    docs: {
      title: () => 'Technical documentation links',
      api: () => 'API docs',
      frontend: () => 'User interface docs',
      backend: () => 'Server docs',
    },
    legal: {
      title: () => 'Further links',
      legalNotice: () => 'Legal notice / Imprint',
      terms: () => 'Terms and conditions',
      mediaLicense: () => 'Information on image licences',
    },
  },
  forms: {
    optional: () => 'optional',
    required: () => 'required',
    create: () => 'Create new Organizer',
    baseInfo: () => 'Basic information',
    address: () => 'Address data',
    name: () => 'Name',
    labelGerman: () => 'German',
    labelGermanEasy: () => 'German: simple Language',
    labelEnglish: () => 'English',
    labelEnglishEasy: () => 'English: simple Language',
    description: () => 'Description',
    teaser: () => 'Teaser',
    classification: () => 'Type of organizer / field of focus (min. 1)',
    type: () => 'Type(s)',
    subjects: () => 'additional options',
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
    urlPlaceholder: () => 'https://example.com',
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
    emailPlaceholder: () => 'e.g. email@example.com',
    password: () => 'Password',
    passwordReset: () => 'Forgot your password?',
    remember: () => 'Stay logged in',
    submit: () => 'login',
    headline: () => 'Log in to kulturdaten.berlin now!',
    loading: () => 'Logging you in',
    error: () => 'The provided login credentials are not valid.',
    registerReference: () => 'New here?',
    registerReferenceLinkText: () => 'Register now.',
  },
  logout: {
    loading: () => 'Logging you out',
    loadingMessage: () => 'Bye!',
  },
  register: {
    email: () => 'Email',
    password: () => 'Password',
    passwordPlaceholder: () => '8+ characters',
    confirmPassword: () => 'Confirm password',
    submit: () => 'sign up',
    headline: () => 'Sign up now! ',
    subline: () => 'Spread your information more convenient via kulturdaten.berlin - for free!',
    loading: () => 'Signing up',
    passwordError: () => 'The entered passwords do not match.',
    requestError: () => "Unfortunately there's a problem with our server. Please try again later.",
    uniqueEmailError: () => 'This account already exists.',
    successHeadline: () => 'Great, that worked!',
    successSubline: () => 'We sent you an email. Check your inbox to activate your account.',
    confirmationText: () => (
      <>
        I hereby confirm that I have read and agree to the{' '}
        <a target="_blank" rel="noreferrer" href="http://kulturdaten.berlin/agb/">
          terms of use
        </a>{' '}
        and{' '}
        <a target="_blank" rel="noreferrer" href="http://kulturdaten.berlin/datenschutzerklaerung/">
          privacy policy
        </a>{' '}
        of kulturdaten.berlin.
      </>
    ),
    loginReference: () => 'Already have an account?',
    loginReferenceLinkText: () => 'Log in here.',
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
    copyright: () => 'Image credits / author',
    copyrightPlaceholder: () => 'e.g. © name of photographer, year of publication',
    copyrightTooltip: () =>
      'Please make sure to include a photo credit or reference to the creator(s) of the image. The format of the image credit depends on the specifications provided by the creator(s), e.g. © name of photographer or agency, year; name of an institution, photo: © name photographer',
    alt: () => 'Alt text',
    altTooltip: () =>
      'Alt texts describe an image as clearly and briefly as possible. They are especially important for blind people who use a screen reader to have website content read aloud. However, search engines find alt texts great as well.',
    license: () => 'License',
    licenses: {
      '1': {
        name: () => 'with attribution (CC BY)',
        href: () => 'https://creativecommons.org/licenses/by/4.0/deed.en',
      },
      '2': {
        name: () => 'without restrictions (public domain)',
        href: () => 'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
      },
      '3': {
        name: () => 'with attribution-ShareAlike (CC BY SA)',
        href: () => 'https://creativecommons.org/licenses/by-sa/4.0/deed.en',
      },
      '4': {
        name: () => 'permitted exclusively in the context of current reporting',
        href: () => 'https://kulturdaten.berlin/daten-bereitstellen/#lizenz',
      },
    },
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
      'In order for the image to be publicly available, the required fields must be filled out.',
    dropZoneLabel: () => 'Upload images',
    usageInfo: () => (
      <>
        <InfoP>Please ensure:</InfoP>
        <InfoUl>
          <InfoLi>
            to upload only those images that may be used free of charge by others - either unaltered
            or in modified form and also for commercial purposes. In the case you chose a CC
            licence, images may also be used on social media.
          </InfoLi>
          <InfoLi>
            to not use any images without the permission of the copyright holder(s). If people are
            depicted in the images, they must have given you their consent for the image to be used
            by third parties.
          </InfoLi>
          <InfoLi>
            that by publishing your image via kulturdaten.berlin, you grant any data users - e.g.
            event portals or app developers - the right to use the image files within the limits of
            moral rights, provided the copyright holder is named.
          </InfoLi>
        </InfoUl>
      </>
    ),
    acknowledgedUsageInfo: () => 'I have read the notice',
  },
  logo: {
    title: () => 'Profile picture / logo',
    titleTooltip: () =>
      'You can upload a logo or profile picture and specify under which licence it can be used by others. If the trademark associated with the logo is registered, it will of course remain protected, regardless of the image licence selected.',
    imageProcessing: () => 'The profile picture / logo is being processed and loaded',
    openImage: () => 'Open original profile picture / logo in new tab',
    delete: () => 'delete profile picture / logo',
    deleteConfirm: () =>
      'Do you really want to delete the profile picture / logo? This cannot be undone.',
    ariaLabel: () => 'Upload profile picture / logo',
    hint: () =>
      'In order for the profile picture / logo to be publicly available, the mandatory fields must be filled out.',
    dropZoneLabel: () => 'Upload profile picture / logo',
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
    actions: () => 'Actions',
    actionsOpen: () => 'Open actions menu',
    actionsClose: () => 'Close actions menu',
    save: () => 'save',
    saving: () => 'saving',
    saved: () => 'saved',
    loading: () => 'loading',
    max: () => 'max.',
    topics: () => 'Keywords (optional)',
    topicsPlaceholder: () => 'Just type away, e.g. Bauhaus',
    takeAFewSeconds: () => 'This can take a few seconds.',
    serverProblem: () =>
      'Unfortunately there is a problem with our server. We are sorry about this. Please try again later.',
    remove: () => 'remove',
    telPlaceholder: () => 'e.g. +49301234567',
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
    format: () => 'Headline',
    lists: () => 'Lists',
    style: () => 'Text style',
    undo: () => 'Undo change',
    redo: () => 'Redo change',
    paragraph: () => 'Paragraph',
    headingOne: () => 'Headline big',
    headingTwo: () => 'Headline middle',
    headingThree: () => 'Headline small',
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
  requirements: {
    title: () => 'Publishing',
    label: () => 'Required information',
    fulfilled: ({ count, total }) => `${count} of ${total} filled out`,
    notFulfilled: () => 'Required information missing',
    isFulfilled: () => 'Required information filled out',
    nameLabel: ({ fieldName }) => `Go to the field '${fieldName}'`,
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
      publishText: () => (
        <>
          This Organizer is a{' '}
          <StatusFlag status={PublishedStatus.draft} variant={StatusFlagVariant.inline} />. Fill in
          the required information and publish it. Only then will its data, Offers and Locations be
          publicly available.
        </>
      ),
      requirements: {
        name: () => 'Name',
        description: () => 'Description',
        categorization: () => 'Type of organizer',
        address: () => 'Internal contact',
      },
      title: {
        plural: () => 'Organizers',
        singular: () => 'Organizer',
      },
      form: {
        create: () => 'Create new Organizer',
        baseInfo: () => 'Basic information',
        address: () => 'Internal contact - for questions regarding this profile',
        addressTooltip: () =>
          'This information is for our internal use and will not be published. Please enter contact and address data  via which we can reach your institution / group / you in case of problems or queries.',
        name: () => 'Name',
        nameTooltip: () =>
          "Please enter the name of your institution, group, or the name you use as a  solo-artist. The name you provide here will automatically appear as the organizer's name when you link an offer to this profile.",
        description: () => 'About you - description (max. 1500 characters)',
        descriptionTooltip: () =>
          'What characterizes your institution / group / your own artistic work? Here you give a brief overview for your audience(s).',
        submit: () => 'create',
        save: () => 'save',
        edit: () => 'edit',
        editCancel: () => 'cancel',
        contact: () => 'Contact for audience / visitor questions',
        tel: () => 'Phone',
        email: () => 'Email',
        website: () => 'Website',
        links: () => 'Additional links (e.g. social media accounts)',
        additionalContacts: () => 'Additional contacts',
        additionalContactsTooltip: () =>
          'Use this option to list additional contacts. You want to add a contact that is only relevant to a specific event? Head to offers and add the contact information to the event in question.',
        topicsTooltip: () => (
          <>
            <TooltipP>
              With theme tags you can indicate more precisely what this organizer is all about, e.g.
              the focus of your collections or the artistic field of your choice.
            </TooltipP>
            <TooltipP>
              These terms are based on the GND (integrated authority file) of the German National
              Library. If there are any terms missing or some concepts seem out of place, please
              feel free to contact us at
              <a href="mailto:hallo@kulturdaten.berlin">hallo@kulturdaten.berlin</a>!
            </TooltipP>
          </>
        ),
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
      options: {
        exportCsv: () => 'Export as CSV',
        exportXls: () => 'Export as Excel',
        delete: () => 'Delete organizer',
        deleteConfirm: () =>
          'Are you sure you want to delete this organizer? This cannot be undone.',
        deleting: () => 'Deleting organizer',
      },
    },
    offer: {
      list: {
        loading: () => 'Loading Offers',
        nothing: () => 'There are no Offers yet. Feel free to create one.',
        nothingFilter: () => 'No Offers found with current filters.',
      },
      publishText: () => (
        <>
          This Offer is a{' '}
          <StatusFlag status={PublishedStatus.draft} variant={StatusFlagVariant.inline} />. Fill in
          the required information and publish it. Only then will its data and dates be publicly
          available.
        </>
      ),
      requirements: {
        name: () => 'Offer title',
        description: () => 'Description',
        categorization: () => 'Topic category',
        mainType: () => 'Event type',
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
        peakHours: () => 'Peak hours',
        mainType: {
          title: () => 'Event type',
          choose: () => 'What kind of offer is it? Exhibition, concert, tour...',
        },
        pricing: {
          title: () => 'Pricing & admission',
          feeLabel: () => 'Cost',
          registrationLabel: () => 'Admission',
          hasFee: () => 'Ticket required',
          noFee: () => 'Free of charge',
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
        topics: () => 'Topic category (required)',
        topicsTooltip: () => (
          <>
            <TooltipP>
              With theme tags you can indicate more precisely what your offer is about, e.g. certain
              types of music or art epochs.
            </TooltipP>
            <TooltipP>
              These terms are based on the GND (integrated authority file) of the German National
              Library. If there are any terms missing or some concepts seem out of place, please
              feel free to contact us at{' '}
              <a href="mailto:hallo@kulturdaten.berlin">hallo@kulturdaten.berlin</a>!
            </TooltipP>
          </>
        ),
      },
      tabs: {
        info: () => 'Information',
        categorization: () => 'Categorization',
        dates: () => 'Dates',
        audience: () => 'Audience',
        accessibility: () => 'Accessibility',
        media: () => 'Images',
      },
      options: {
        exportCsv: () => 'Export as CSV',
        exportXls: () => 'Export as Excel',
        delete: () => 'Delete offer',
        deleteConfirm: () => 'Are you sure you want to delete this offer? This cannot be undone.',
        deleting: () => 'Deleting offer',
      },
    },
    location: {
      list: {
        loading: () => 'Loading Locations',
        nothing: () => 'There are no Locations yet. Feel free to create one.',
        nothingFilter: () => 'No Locations found with current filters.',
        allOrMy: () => 'Show selection',
        allLocations: () => 'All public Locations',
        myLocations: () => 'Only my Locations',
      },
      title: {
        plural: () => 'Locations',
        singular: () => 'Location',
      },
      publishText: () => (
        <>
          This Location is a{' '}
          <StatusFlag status={PublishedStatus.draft} variant={StatusFlagVariant.inline} />. Fill in
          the required information and publish it. Only then will its data be publicly available.
        </>
      ),
      requirements: {
        name: () => 'Name of the location',
        description: () => 'Description',
      },
      form: {
        openingHours: () => 'Opening hours',
        create: () => 'Create new Location',
        address: () => 'Address data',
        name: () => 'Name of the location',
        namePlaceholder: () => "e.g. 'Kleines Theater' or 'Gallery XY on Youtube'",
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
        districtPlaceholder: () => 'Choose district',
        url: () => 'URL / venue information',
        urlPlaceholder: () => 'e.g. https://theatreberlin.de/virtualstage',
        rent: {
          title: () => 'Rent',
          url: () => 'Rent link / Rent information',
          urlPlaceholder: () => 'e.g. https://example.com',
        },
        type: {
          title: () => 'Type of the Location',
          physicalLabel: () => 'Physical Location',
          physicalText: () => 'A physically existing location with an address, e.g. a building.',
          virtualLabel: () => 'Virtual Location',
          virtualText: () =>
            'Do your events and offers take place online - on your own platform or social media channels? Add your virtual location here once and link it conveniently with your online offers later.',
        },
      },
      tabs: {
        info: () => 'Information',
        service: () => 'Service',
        accessibility: () => 'Accessibility',
        media: () => 'Images',
      },
      options: {
        exportCsv: () => 'Export as CSV',
        exportXls: () => 'Export as Excel',
        delete: () => 'Delete location',
        deleteConfirm: () =>
          'Are you sure you want to delete this location? This cannot be undone.',
        deleting: () => 'Deleting location',
      },
    },
  },
  menu: {
    title: () => 'kulturdaten.berlin',
    main: () => 'Main Menu',
    button: {
      open: () => 'open menu',
      close: () => 'close menu',
    },
    start: {
      title: () => 'Start',
      items: {
        back: () => 'back to Dashboard',
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
    organizerBand: {
      show: () => 'Show list of my organizers',
      collapse: () => 'Hide list of my organizers',
      create: () => 'Create new organizer',
      loading: () => 'Changing active organizer',
    },
  },
};
