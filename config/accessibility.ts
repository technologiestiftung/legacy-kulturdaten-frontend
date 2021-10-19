import { InputType } from '../components/input';
import { AccessibilityCategory, AccessibilityFieldType } from '../lib/accessibility';
import { Language } from './locale';

export const locationAccessibility: AccessibilityCategory[] = [
  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Planung & Anreise',
        },
      },
      {
        attributes: {
          language: Language.de,
          name: 'Planning & arrival',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Wer beantwortet Fragen zur Barrierefreiheit vor Ort?',
            },
          },
          {
            attributes: {
              language: Language.de,
              name: 'Who answers questions about accessibility?',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceContact',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Name / Bezeichnung',
                  placeholder: 'Hier ein Placeholder',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Name / title',
                  placeholder: 'Here a placeholder',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.servicePhoneNumber',
              type: InputType.tel,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Telefon',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Phone',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceMail',
              type: InputType.email,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'E-Mail',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Email',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceHours',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Erreichbarkeit',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Office hours',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.select,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Buchungsoption',
                  placeholder: 'Buchungsoption Placeholder',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Booking mode',
                  placeholder: 'Booking mode placeholder',
                },
              },
            ],
            data: {
              key: 'planning.bookingMode',
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
                        name: 'Tickets nur an der Kasse',
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
                {
                  value: 'other',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Sonstiges',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'other',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Bieten die regulären Parkplätze vor Ort genug Platz für Rollstühle?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Do the regular parking spaces on site offer enough space for wheelchair users?',
                },
              },
            ],
            data: {
              key: 'planning.parking',
              options: [
                {
                  value: 'yes',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ja',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Yes',
                      },
                    },
                  ],
                },
                {
                  value: 'no',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Nein',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'No',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Service - Welche Unterstützung beim Besuch ermöglicht ihr?',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'Service - Do you offer any additional support to ease the visit?',
                },
              },
            ],
            data: {
              key: 'planning.accessService',
              options: [
                {
                  value: 'assistantDogs',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Assistenzhunde willkommen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'assistance dogs welcome',
                      },
                    },
                  ],
                },
                {
                  value: 'assistant',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Assistenzpersonal / kostenloser Begleitservice',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'free assistant for visitors',
                      },
                    },
                  ],
                },
                {
                  value: 'foldingChair',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Klapphocker ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'folding chair available',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchair',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Rollstuhl ausleihbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'wheelchair available',
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
                        language: Language.de,
                        name: 'headphones available',
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
                        language: Language.de,
                        name: 'ear protection available',
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
                        language: Language.de,
                        name: 'hearing aid available',
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
              name: 'Was findet man am Eingang vor?',
            },
          },
          {
            attributes: {
              language: Language.de,
              name: 'Please describe the entrance to the premises.',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.conditional,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Treppen',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'stairs',
                },
              },
            ],
            data: {
              key: 'planning.entry.stairs',
              fields: [
                {
                  type: AccessibilityFieldType.input,
                  data: {
                    type: InputType.number,
                    key: 'planning.entry.stairs.count',
                  },
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wie viele Stufen findet man vor?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'How many steps are there?',
                      },
                    },
                  ],
                },
                {
                  type: AccessibilityFieldType.checkboxList,
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wie sind die Stufen beschaffen?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'What are the stairs like?',
                      },
                    },
                  ],
                  data: {
                    key: 'planning.entry.stairs.properties',
                    options: [
                      {
                        value: 'slipNosing',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'mit Rutschschutz',
                            },
                          },
                          {
                            attributes: {
                              language: Language.de,
                              name: 'has anti-slip nosing',
                            },
                          },
                        ],
                      },
                      {
                        value: 'stepEdgesMarked',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Stufenkanten sind gekennzeichnet (z.B. Farbstreifen)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.de,
                              name: 'step edges are marked (e.g. coloured stripes)',
                            },
                          },
                        ],
                      },
                      {
                        value: 'tactileSafetyStrips',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'mit taktilen Sicherheitsstreifen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.de,
                              name: 'has tactile safety strips',
                            },
                          },
                        ],
                      },
                      {
                        value: 'completeHandrail',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'mit vollständigem Geländer',
                            },
                          },
                          {
                            attributes: {
                              language: Language.de,
                              name: 'has handrail from beginning to end',
                            },
                          },
                        ],
                      },
                      {
                        value: 'highSteps',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'sehr hohe Stufen (21 cm oder mehr)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.de,
                              name: 'high steps (21cm and more)',
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
