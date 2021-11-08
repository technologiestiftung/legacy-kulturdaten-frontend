import { GenericFormCategory, GenericFormFieldType } from '../lib/genericForm';
import { Language } from './locale';

export const locationService: GenericFormCategory[] = [
  {
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Service',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Service',
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
                  name: 'Praktische Informationen',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Practical information',
                },
              },
            ],
            data: {
              key: 'services.practicalInfo',
              options: [
                {
                  value: 'freeCloakroom',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'kostenlose Garderobe',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'cloakroom (free of charge)',
                      },
                    },
                  ],
                },
                {
                  value: 'freeLockers',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'kostenlose Schließfächer / Pfandschließfächer',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'lockers (free of charge)',
                      },
                    },
                  ],
                },
                {
                  value: 'wifi',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Gäste-WLAN',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Wi-Fi available',
                      },
                    },
                  ],
                },
                {
                  value: 'phoneChargers',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Handy-Ladestation',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'mobile phone charging station',
                      },
                    },
                  ],
                },
                {
                  value: 'photoAllowed',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Fotografieren erlaubt',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'photography allowed',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Erholung & Rückzugsmöglichkeiten',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Resting & relaxation',
                },
              },
            ],
            data: {
              key: 'services.resting',
              options: [
                {
                  value: 'seatingEverywhere',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Sitzgelegenheiten in jedem Gebäudeabschnitt vorhanden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'seating facilities in every part of the building',
                      },
                    },
                  ],
                },
                {
                  value: 'restingZones',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ruheraum oder -zone mit Sitz- oder Liegemöglichkeit',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Rooms or resting zones with possibility to sit or lie down',
                      },
                    },
                  ],
                },
                {
                  value: 'playArea',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Spielbereich für Kinder',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: "children's play area",
                      },
                    },
                  ],
                },
                {
                  value: 'earProtection',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Gehörschutz ausleihbar (z.B. Ohrstöpsel)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'ear protection available',
                      },
                    },
                  ],
                },
                {
                  value: 'headphones',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kopfhörer ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'headphones available',
                      },
                    },
                  ],
                },
                {
                  value: 'hearingAid',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Hörhilfe ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'hearing aid available',
                      },
                    },
                  ],
                },
                {
                  value: 'foldingChairs',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Klapphocker ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'folding chairs available',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchairs',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Rollstuhl ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'wheelchairs available',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Essen & Trinken',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Food & drink',
                },
              },
            ],
            data: {
              key: 'services.food',
              options: [
                {
                  value: 'cafe',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Café',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'café',
                      },
                    },
                  ],
                },
                {
                  value: 'bar',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Bar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'bar',
                      },
                    },
                  ],
                },
                {
                  value: 'playArea',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Restaurant',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'restaurant',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Für Personen mit Kindern',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'For visitors with children',
                },
              },
            ],
            data: {
              key: 'services.children',
              options: [
                {
                  value: 'nursingArea',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Stillbereich',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'nursing area',
                      },
                    },
                  ],
                },
                {
                  value: 'diaperChanging',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wickeltisch',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'diaper-changing stations',
                      },
                    },
                  ],
                },
                {
                  value: 'strollerFriendly',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'kinderwagengerecht',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'stroller friendly',
                      },
                    },
                  ],
                },
                {
                  value: 'childCareServices',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kinderbetreuung verfügbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'child care services available',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Weitere Services',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Other services',
                },
              },
            ],
            data: {
              key: 'services.other',
              options: [
                {
                  value: 'park',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Park / Garten',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'park / garden',
                      },
                    },
                  ],
                },
                {
                  value: 'library',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Bibliothek',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'library',
                      },
                    },
                  ],
                },
                {
                  value: 'archive',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Archiv',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'archive',
                      },
                    },
                  ],
                },
                {
                  value: 'cinema',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kino',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'cinema',
                      },
                    },
                  ],
                },
                {
                  value: 'shop',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Shop',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'shop',
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
