import { GenericFormCategory, GenericFormFieldType } from '../lib/genericForm';
import { Language } from './locale';

export const offerAudience: GenericFormCategory[] = [
  {
    children: [
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
        children: [],
      },
    ],
  },
];
