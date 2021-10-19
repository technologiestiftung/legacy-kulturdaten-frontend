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
          language: Language.en,
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
              language: Language.en,
              name: 'Who answers questions about accessibility?',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceAddress.serviceContact',
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
                  language: Language.en,
                  name: 'Name / title',
                  placeholder: 'Here a placeholder',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceAddress.servicePhoneNumber',
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
                  language: Language.en,
                  name: 'Phone',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceAddress.serviceMail',
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
                  language: Language.en,
                  name: 'Email',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.serviceAddress.serviceHours',
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
                  language: Language.en,
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
              key: 'planning.admissionInfo.bookingMode',
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
            type: AccessibilityFieldType.select,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Ermäßigungen',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Reduced admission',
                },
              },
            ],
            data: {
              key: 'planning.admissionInfo.admissionAccessibility',
              options: [
                {
                  value: 'impairmentVisitors',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ermäßigung für Menschen mit Behinderung / Beeinträchtigung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Reduced admission for visitors with disability / impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'impairmentAccompany',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ermäßigungen für Begleitpersonen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'Discounted admission for attendant accompanying a visitor with a disability / impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'noLibraryCard',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Zugang für Begleitperson auch ohne Nutzer:innenausweis',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Free library card / no library card needed for attendant',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.admissionInfo.admissionLink',
              type: InputType.url,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Details zu Eintritt / Tickets für Menschen mit Behinderung / Beeinträchtigung:',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Details on admission / tickets for people with disabilities:',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.arrivalInfo.accessOPNV',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Anreise - Ob per ÖPNV, per Auto oder auf anderem Weg: Was muss man wissen, wenn man zu euch kommt?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Getting there - Whether by public transport, by car or by other means: What is there to know for people traveling to you?',
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
                  name: 'Wie ist die Haltestelle ausgestattet?:',
                },
              },
              {
                attributes: {
                  language: Language.de,
                  name: 'How is the public transport stop equipped?',
                },
              },
            ],
            data: {
              key: 'planning.arrivalInfo.accessOPNVinfo',
              options: [
                {
                  value: 'elevator',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Mit Aufzug',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'With elevator',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchairRamp',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Mit Rollstuhlrampe',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'With ramp for wheelchairs',
                      },
                    },
                  ],
                },
                {
                  value: 'tactilePaving',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Mit Blindenleitsystem',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: 'With tactile paving',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.arrivalInfo.accessDirections',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Was wäre der beste Weg von der Haltestelle zum Gebäude für Menschen mit Behinderung / Beeinträchtigung?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'What would be the best route from the public transport stop to the building for people with disabilities?',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Besteht die Möglichkeit, am Eingang zu halten, z.B. für Taxidienste?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Is there a possibility to stop close to the entrance, e.g. for taxi services?',
                },
              },
            ],
            data: {
              key: 'planning.arrivalInfo.accessTaxi',
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
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Parken - Gibt es ausgewiesene Parkplätze für Menschen mit Behinderung / Beeinträchtigung?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Parking - Are there dedicated parking spaces for people with disabilities?',
                },
              },
            ],
            data: {
              key: 'planning.arrivalInfo.hasDedicatedParking',
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
                        language: Language.en,
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
                        language: Language.en,
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
                  name: 'Gibt es bestimmte Nutzungsbedingungen?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Is a registration or special parking permitt required?',
                },
              },
            ],
            data: {
              key: 'planning.arrivalInfo.neededParkingPermits',
              options: [
                {
                  value: 'reservation',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Voranmeldung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Parking space needs to be reserved in advance',
                      },
                    },
                  ],
                },
                {
                  value: 'blueCard',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Blauer EU-Parkausweis',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Blue EU disability parking card required',
                      },
                    },
                  ],
                },
                {
                  value: 'orangeCard',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Oranger Ausweis über Parkerleichterung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: "Orange 'Ausweis über Parkerleichterung'",
                      },
                    },
                  ],
                },
                {
                  value: 'disabledPass',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Schwerbehindertenausweis',
                      },
                    },
                    {
                      attributes: {
                        language: Language.de,
                        name: "'Schwerbehindertenausweis' required",
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
                  name:
                    'Do the regular parking spaces on site offer enough space for wheelchair users?',
                },
              },
            ],
            data: {
              key: 'planning.arrivalInfo.spaceForWheelchair',
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
                        language: Language.en,
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
                        language: Language.en,
                        name: 'No',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.arrivalInfo.parkingInfo',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkung',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'A note on parking',
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
