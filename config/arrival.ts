import { InputType } from '../components/input';
import { GenericFormCategory, GenericFormFieldType } from '../lib/genericForm';
import { Language } from './locale';

export const locationArrival: GenericFormCategory[] = [
  {
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Mit Fahrrad / PKW',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'By bicycle / car',
            },
          },
        ],
        children: [
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Angaben zu Parkmöglichkeiten',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Parking information',
                },
              },
            ],
            data: {
              key: 'services.parking',
              options: [
                {
                  value: 'onSite',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Parkplätze am Haus / direkt am Ort',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'parking facilities on site',
                      },
                    },
                  ],
                },
                {
                  value: 'nearby',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: '(eingeschränkte) Parkmöglichkeiten in der Nähe',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'limited parking nearby',
                      },
                    },
                  ],
                },
                {
                  value: 'accessibleParking',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Parkplätze für Menschen mit Behinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'parking spaces for people with disabilities',
                      },
                    },
                  ],
                },
                {
                  value: 'none',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'keine Parkmöglichkeiten',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'no parking facilities',
                      },
                    },
                  ],
                },
                {
                  value: 'bicycleParking',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Fahrradstellplätze vorhanden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'bicycle parking space available',
                      },
                    },
                  ],
                },
                {
                  value: 'evCharging',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'E-Ladesäule vorhanden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'EV charging station available',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Mit öffentlichen Verkehrsmitteln',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'By public transportation',
            },
          },
        ],
        children: [
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'services.publicTransport',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Name der nächstgelegene ÖPNV-Haltestelle',
                  placeholder: 'z.B. Zoologischer Garten',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Name of closest public transport stop',
                  placeholder: 'e.g. Zoologischer Garten',
                },
              },
            ],
          },
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'services.publicTransport.bus',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Bus-Liniennummer(n)',
                  placeholder: 'z.B. 100, 109',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Bus line number(s)',
                  placeholder: 'e.g. 100, 109',
                },
              },
            ],
          },
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'services.publicTransport.tram',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Tram-Liniennummer(n)',
                  placeholder: 'z.B. M1, M2, M3',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Tram line number(s)',
                  placeholder: 'e.g. M1, M2, M3',
                },
              },
            ],
          },
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'services.publicTransport.sbahn',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'S-Bahn-Liniennummer(n)',
                  placeholder: 'z.B. S3, S5',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'S-Bahn line number(s)',
                  placeholder: 'e.g. S3, S5',
                },
              },
            ],
          },
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'services.publicTransport.ubahn',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'U-Bahn-Liniennummer(n)',
                  placeholder: 'z.B. U2, U3',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'U-Bahn (metro) line number(s)',
                  placeholder: 'e.g. U2, U3',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
