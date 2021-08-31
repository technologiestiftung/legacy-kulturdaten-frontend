import { Language } from '../config/locale';
import { OfferDate, OfferDateStatus } from '../lib/api/types/offer';

export const dummyDates: OfferDate[] = [
  {
    data: {
      id: '0',
      attributes: {
        from: new Date('2021-08-31T14:30:00'),
        to: new Date('2021-08-31T17:30:00'),
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
        from: new Date('2021-08-31T00:00:00'),
        to: new Date('2021-09-01T00:00:00'),
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
];
