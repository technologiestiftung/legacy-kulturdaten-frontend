import { Language } from '../config/locale';
import { OfferDate, OfferDateStatus } from '../lib/api/types/offer';

export const dummyDates: OfferDate[] = [
  {
    data: {
      id: '0',
      attributes: {
        from: '2021-08-31T14:30:00',
        to: '2021-08-31T17:30:00',
        allDay: false,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 0,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 0',
            },
          },
          {
            id: 1,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 0',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '1',
      attributes: {
        from: '2021-08-31T00:00:00',
        to: '2021-09-01T00:00:00',
        allDay: true,
        status: OfferDateStatus.cancelled,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 1',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 1',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '2',
      attributes: {
        from: '2021-09-01T00:00:00',
        to: '2021-09-03T00:00:00',
        allDay: true,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 2',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 2',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '3',
      attributes: {
        from: '2021-09-02T12:00:00',
        to: '2021-09-03T16:00:00',
        allDay: false,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 3',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 3',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '4',
      attributes: {
        from: '2021-09-04T20:00:00',
        to: '2021-09-04T23:00:00',
        allDay: false,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 4',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 4',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '5',
      attributes: {
        from: '2021-09-05T12:00:00',
        to: '2021-09-05T15:30:00',
        allDay: false,
        status: OfferDateStatus.cancelled,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 5',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 5',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '6',
      attributes: {
        from: '2021-09-07T00:00:00',
        to: '2021-09-08T00:00:00',
        allDay: true,
        status: OfferDateStatus.cancelled,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: '',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: '',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '7',
      attributes: {
        from: '2021-09-20T14:00:00',
        to: '2021-09-20T16:00:00',
        allDay: false,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin 7',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date 7',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '8',
      attributes: {
        from: '2021-10-01T10:00:00',
        to: '2021-10-01T12:00:00',
        allDay: false,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date',
            },
          },
        ],
      },
    },
  },
  {
    data: {
      id: '9',
      attributes: {
        from: '2021-10-12T00:00:00',
        to: '2021-10-13T00:00:00',
        allDay: true,
        status: OfferDateStatus.confirmed,
        ticketLink: 'https://ticket.link',
      },
      relations: {
        translations: [
          {
            id: 10,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.de,
              name: 'Dummy Termin',
            },
          },
          {
            id: 11,
            type: 'offerdatetranslation',
            attributes: {
              language: Language.en,
              name: 'Dummy Date',
            },
          },
        ],
      },
    },
  },
];
