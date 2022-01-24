import { GenericFormCategory, GenericFormFieldType } from '../lib/genericForm';
import { Language } from './locale';

export const testServices: GenericFormCategory[] = [
  {
    collapsable: false,
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Services',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'Services',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Test Tags',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Test tags',
            },
          },
        ],
        children: [
          {
            type: GenericFormFieldType.tags,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Buchungsoption',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Booking mode',
                },
              },
            ],
            data: {
              i18nKeys: {
                addButton: 'languageTags.addButton',
                addLabel: 'languageTags.addLabel',
                addPlaceholder: 'languageTags.addPlaceholder',
                listDelete: 'languageTags.listDelete',
                listLabel: 'languageTags.listLabel',
                listPlaceholder: 'languageTags.listPlaceholder',
                noMatch: 'languageTags.noMatch',
              },
              key: 'test.services.languages',
              options: [
                {
                  value: 'online',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'online buchbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'online ticketing',
                      },
                    },
                  ],
                },
                {
                  value: 'boxOffice',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tickets an der Kasse',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ticket / box office',
                      },
                    },
                  ],
                },
                {
                  value: 'hotlineEmail',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tickets per Anruf / E-Mail',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'telephone hotline / email',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
