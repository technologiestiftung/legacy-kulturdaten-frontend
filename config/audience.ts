import { GenericFormCategory, GenericFormFieldType } from '../lib/genericForm';
import { dinLanguages } from './dinLanguages';
import { Language } from './locale';

export const offerAudience: GenericFormCategory[] = [
  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Zielgruppe',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'Audience',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Sprache des Angebots',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Language of the Offer',
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
                  name: 'Sprachen',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Languages',
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
              options: dinLanguages,
            },
          },
        ],
      },
    ],
  },
];
