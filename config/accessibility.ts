import { InputType } from '../components/input';
import {
  AccessibilityCategory,
  AccessibilityFieldConditionType,
  AccessibilityFieldType,
} from '../lib/accessibility';
import { Language } from './locale';

export const locationAccessibility: AccessibilityCategory[] = [
  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Allgemein',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'General',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Wie zugänglich ist der Ort grundsätzlich:',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'How accessible is the place:',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.select,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Wurde der Ort bereits auf Barrierefreiheit geprüft?',
                  tooltip: {
                    content: [
                      'Nicht die richtige Option dabei? Schreib uns unter hallo@kulturdaten.berlin!',
                    ],
                  },
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Has the site already been checked for accessibility?',
                },
              },
            ],
            data: {
              key: 'general.accessGeneral.accessibilityVerified',
              options: [
                {
                  value: 'no',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'nein',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'no',
                      },
                    },
                  ],
                },
                {
                  value: 'reisenFuerAlle',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: "ja, via 'Reisen für alle'",
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: "yes, tested by 'Reisen für alle'",
                      },
                    },
                  ],
                },
                {
                  value: 'mobidat',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: "ja, via 'Mobidat'",
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: "yes, tested by 'Mobidat'",
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
              key: 'general.accessGeneral.testReportUrl',
              type: InputType.url,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Falls vorhanden: Bitte hinterlege einen Link zum Prüfbericht.',
                  placeholder: 'https://example.com',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'If available: Please provide a link to the test report.',
                  placeholder: 'https://example.com',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'general.accessGeneral.serviceWebsiteUrl',
              type: InputType.url,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Gibt es auf eurer Website Informationen zum barrierefreien Besuch eurer Räumlichkeiten?',
                  placeholder: 'https://example.com',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Is there information online about visiting your premises?',
                  placeholder: 'https://example.com',
                },
              },
            ],
          },
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'general.accessGeneral.premisesPreview',
              type: InputType.url,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Kann man den Ort online vorab anschauen - z.B. in Bildergalerien der Räume oder über eine 360-Grad-Ansicht?',
                  placeholder: 'https://example.com',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Is it possible to view the venue online in advance - e.g. in picture galleries of the rooms or via a 360-degree view?',
                  placeholder: 'https://example.com',
                },
              },
            ],
          },
        ],
      },
    ],
  },
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
                  placeholder: 'z.B. Besuchsdienste; Paul Muster',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Name / title',
                  placeholder: 'e.g. visiting service',
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
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'planning.serviceAddress.serviceHours',
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
        ],
      },
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name:
                'Ticketkauf - Lasst eure Besucher:innen wissen, wie sie Tickets erwerben können.',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Admission - Let your visitors know how they can purchase tickets.',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.select,
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
        ],
      },
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Gibt es Ermäßigungen?',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Are there any discounts?',
            },
          },
        ],
        children: [
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
        ],
      },
      {
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
              name: ' Details on admission / tickets for people with disabilities:',
            },
          },
        ],
        children: [
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
                  name: 'URL für Details:',
                  placeholder: 'z.B. zu Bedingungen für eine Ermäßigung',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'URL for details:',
                  placeholder: 'e.g. on conditions for a reduced admission',
                },
              },
            ],
          },
        ],
      },
      {
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
        children: [
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
                  name: 'ÖPNV - Welches ist die nächstgelegene barrierefreie Haltestelle?:',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Public transport - please describe the accessibility of public transport stops nearby:',
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
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'planning.arrivalInfo.accessDirections',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Was wäre der beste Weg von der Haltestelle zum Gebäude für Menschen mit Behinderung / Beeinträchtigung?',
                  placeholder: 'Wegbeschreibung eingeben',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'What would be the best route from the public transport stop to the building for people with disabilities?',
                  placeholder: 'Enter directions',
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
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'planning.arrivalInfo.parkingInfo',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkung',
                  placeholder: 'z.B. wo findet man die Parkplätze?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'A note on parking',
                  placeholder:
                    'e.g. where to find the parking spaces? Do you have to book in advance?',
                },
              },
            ],
          },
        ],
      },
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Service vor Ort',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Service on site',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Welche Unterstützung beim Besuch ermöglicht ihr?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Do you offer any additional support to ease the visit?',
                },
              },
            ],
            data: {
              key: 'planning.entranceService.accessService',
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
                        language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
                        name: 'hearing aid available',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'planning.entranceService.accessServiceInfo',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkung',
                  placeholder: 'z.B. muss man Assistenzhunde vorher anmelden?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Your comment',
                  placeholder: 'e.g. do visitors have to register assistance dogs in advance?',
                },
              },
            ],
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
              language: Language.en,
              name: 'Please describe the entrance to the premises.',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'ebenerdiger Zugang',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'ground-level entrance',
                },
              },
            ],
            data: {
              key: 'planning.entry.groundLevelEntrance',
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
            type: AccessibilityFieldType.conditional,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Türen',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'doors',
                },
              },
            ],
            data: {
              key: 'planning.entry.doors',
              fields: [
                {
                  type: AccessibilityFieldType.checkboxList,
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Was trifft auf die Eingangstür zu?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'What applies to the entrance door?',
                      },
                    },
                  ],
                  data: {
                    key: 'planning.entry.doors.doorType',
                    options: [
                      {
                        value: 'toOutside',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'öffnen nach außen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'opens to outside',
                            },
                          },
                        ],
                      },
                      {
                        value: 'toInside',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'öffnen nach innen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'opens to inside',
                            },
                          },
                        ],
                      },
                      {
                        value: 'bothDirections',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'öffnet in beide Richtungen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'opens in both directions',
                            },
                          },
                        ],
                      },
                      {
                        value: 'narrowEntrance',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'schmale Tür (Breite weniger als 80 cm)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'narrow entrance (less than 80 cm)',
                            },
                          },
                        ],
                      },
                      {
                        value: 'heavyDoor',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Tür ist schwer oder öffnet schwer',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'heavy door / difficult to open',
                            },
                          },
                        ],
                      },
                      {
                        value: 'highThreshold',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Türschwelle höher als 2 cm',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'threshold is higher than 2 cm',
                            },
                          },
                        ],
                      },
                      {
                        value: 'revolvingDoor',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Drehtür / Rotationstür',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'revolving door',
                            },
                          },
                        ],
                      },
                      {
                        value: 'automaticDoor',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'öffnet automatisch / immer offen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'opens automatically or is always open',
                            },
                          },
                        ],
                      },
                      {
                        value: 'glassDoorMarking',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name:
                                'Glastür mit kontrastreichen Markierungen (z.B. Institutionsname als Aufkleber oder farbig abgesetzte Gravur)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'glass door, with clear marking',
                            },
                          },
                        ],
                      },
                      {
                        value: 'glassDoorNoMarking',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Glastür ohne Markierungen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'glass door, without clear marking',
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
                  language: Language.en,
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
                        language: Language.en,
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
                        language: Language.en,
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
                              language: Language.en,
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
                              language: Language.en,
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
                              language: Language.en,
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
                              language: Language.en,
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
                              language: Language.en,
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
          {
            type: AccessibilityFieldType.conditional,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Fahrstuhl',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'elevator',
                },
              },
            ],
            data: {
              key: 'planning.entry.elevator',
              fields: [
                {
                  type: AccessibilityFieldType.input,
                  data: {
                    type: InputType.text,
                    key: 'planning.entry.elevator.elevatorLocation',
                  },
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wo befindet sich der Fahrstuhl?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Where is the elevator located?',
                      },
                    },
                  ],
                },
                {
                  type: AccessibilityFieldType.input,
                  data: {
                    type: InputType.number,
                    key: 'planning.entry.elevator.cabinLength',
                  },
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wie ist er beschaffen? (Kabinen-Tiefe)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Please describe its internal dimensions. (Cabin length)',
                      },
                    },
                  ],
                },
                {
                  type: AccessibilityFieldType.input,
                  data: {
                    type: InputType.number,
                    key: 'planning.entry.elevator.cabinWidth',
                  },
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Wie ist er beschaffen? (Kabinen-Breite)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Please describe its internal dimensions. (Cabin width)',
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
                        name: 'Wie wird die Bedienung des Aufzugs unterstützt?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: "How would you describe the elevator's controls?",
                      },
                    },
                  ],
                  data: {
                    key: 'planning.entry.elevator.usage',
                    options: [
                      {
                        value: 'reachedWithWheelchair',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name:
                                'Tasten von Rollstuhl aus erreichbar (z.B. horizontal angeordnet)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name:
                                'buttons can be reached with a wheelchair (e.g. arranged horizontally)',
                            },
                          },
                        ],
                      },
                      {
                        value: 'tactile',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name:
                                'Beschilderung und Tasten sind taktil (z.B. in Braille, hervorstehende Zahlen, etc.)',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name:
                                'labeling and buttons are tactile (e.g. in braille, protruding numbers, etc.).',
                            },
                          },
                        ],
                      },
                      {
                        value: 'illuminatedButtons',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Tasten sind beleuchtet',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'buttons are illuminated',
                            },
                          },
                        ],
                      },
                      {
                        value: 'floorsAudioSignals',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Etagen werden angesagt',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'floors are announced / indicated via audio signals',
                            },
                          },
                        ],
                      },
                      {
                        value: 'floorsDisplayedVisually',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Etage wird visuell angezeigt',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'floor numbers are displayed visually',
                            },
                          },
                        ],
                      },
                      {
                        value: 'pictogramControlls',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Bedienelemente mit Piktogrammen',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'controlls with pictograms',
                            },
                          },
                        ],
                      },
                      {
                        value: 'emergencyCallSignal',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Notruf wird akustisch bestätigt',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'acoustic signal confirms successful emergency call',
                            },
                          },
                        ],
                      },
                      {
                        value: 'emergencyCallVisual',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'Notruf wird optisch bestätigt',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'emergency call is confirmed visually',
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
          {
            type: AccessibilityFieldType.conditional,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Rampe',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'ramp',
                },
              },
            ],
            data: {
              key: 'planning.entry.ramp',
              fields: [
                {
                  type: AccessibilityFieldType.select,
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Welche Art von Rampe ist es?',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'What type of ramp is it?',
                      },
                    },
                  ],
                  data: {
                    key: 'planning.entry.ramp.type',
                    options: [
                      {
                        value: 'fixed',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name:
                                'fest installierte, rollstuhlgerechte Rampe (mind. 120cm Laufbreite, max. 6 Grad Neigung)',
                              tooltip: {
                                content: ['mind. 120cm Laufbreite, max. 6 Grad Neigung'],
                              },
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'fixed, wheelchair-friendly ramp',
                            },
                          },
                        ],
                      },
                      {
                        value: 'removable',
                        translations: [
                          {
                            attributes: {
                              language: Language.de,
                              name: 'bewegliche Rampe',
                            },
                          },
                          {
                            attributes: {
                              language: Language.en,
                              name: 'removable ramp',
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
          {
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Treppenlift / Hublift, selbst bedienbar',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'stair lift / hoist lift, self-operable',
                },
              },
            ],
            data: {
              key: 'planning.entry.stairLiftSelfOperable',
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
            type: AccessibilityFieldType.radioList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Treppenlift / Hublift, Bedienung durch Personal',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'stair lift / hoist lift, operated by staff',
                },
              },
            ],
            data: {
              key: 'planning.entry.stairLiftStaffOperated',
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
                  name: 'Gibt es Hilfe, wenn Besucher:innen Probleme beim Zugang haben?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Is there any help if visitors need assistance with entering the location?',
                },
              },
            ],
            data: {
              key: 'planning.entry.accessHelp',
              options: [
                {
                  value: 'intercom',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Sprechanlage am Eingang',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'entrance with intercom',
                      },
                    },
                  ],
                },
                {
                  value: 'doorbellReachable',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Klingel in Rollstuhlhöhe erreichbar (nicht höher als 85 cm über Boden)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'doorbell can be reached from a wheelchair (not higher than 85 cm from floor)',
                      },
                    },
                  ],
                },
                {
                  value: 'entranceVisibleFoyer',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Eingangsbereich ist für Servicekräfte einsehbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'entrance visible from foyer / service area',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'planning.entry.entranceConstraints',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkungen',
                  placeholder:
                    'z.B. Kiesfläche vor Tür, Kasse nicht sofort sichtbar, Schranken, Poller, Taschenkontrolle, etc.',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Your comment',
                  placeholder:
                    'e.g. counters and information desk not immediately visible; gates or bollards; security check, etc.',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Im Foyer',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'In the foyer',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Kassen, Garderoben, Toiletten',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Ticket offices, cloakrooms, toilets',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.input,
            data: {
              key: 'foyer.foyer.counters',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Wie hoch sind Schalter/ Kassen/ Tresen im Foyer bzw. Eingangsbereich?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'What is the height of counters/ cash registers/ info desks in the foyer or entrance area?',
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
                  name:
                    'Kommunikation - Wie interargiert man mit dem Personal bei Sprachbarrieren oder wenn Schalter zu hoch sind?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Communication - How to interact with the staff in case of language barriers or when counters are too high?',
                },
              },
            ],
            data: {
              key: 'foyer.foyer.altCommunication',
              options: [
                {
                  value: 'whileSitting',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Verständigung im Sitzen möglich',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Communication possible while sitting',
                      },
                    },
                  ],
                },
                {
                  value: 'inductiveHearingSystem',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'induktive Höranlage an Kasse / Infoschalter',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'counter / info desk with inductive hearing system',
                      },
                    },
                  ],
                },
                {
                  value: 'writtenInfo',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Ticket-/Besuchsinformationen liegen auch schriftlich vor',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Ticket/visiting information also available in writing',
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
                  name:
                    'Wie bereitet sich ihr Personal im Eingangsbereich auf Besucher:innen mit Behinderung / Beeinträchtigung vor?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'How does your entrance staff prepare for visitors with disabilities / impairments?',
                },
              },
            ],
            data: {
              key: 'foyer.foyer.staffQualification',
              options: [
                {
                  value: 'inclusionAwarenessTraining',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Servicepersonal nimmt an Inklusionstrainings teil',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'service staff participates in disability / inclusion awareness training',
                      },
                    },
                  ],
                },
                {
                  value: 'peopleWithDisability',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Menschen mit Behinderung / Beeinträchtigung Teil des Personals',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'staff also consists of people with disability / impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'multipleLanguages',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Personal ist mehrsprachig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'staff offers multiple languages',
                      },
                    },
                  ],
                },
                {
                  value: 'planIncludesMeasures',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Notfallplan enthält auch Maßnahmen für Menschen mit Behinderung / Beeinträchtigung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'emergency plan also includes measures for people with disabilities / impairments.',
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
                  name:
                    'Lassen sich Garderoben und Schließfächer auch mit sehr großen (Elektro-)Rollstühlen erreichen?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Can cloakrooms and lockers be reached with very large wheelchairs?',
                },
              },
            ],
            data: {
              key: 'foyer.foyer.coatCheck',
              options: [
                {
                  value: 'completely',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'vollständig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'completely',
                      },
                    },
                  ],
                },
                {
                  value: 'partially',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'teilweise',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'partially',
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
                        name: 'gar nicht',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'not at all',
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
                    'Können in der Garderobe auch sperrige Geräte abgegeben werden (z.B. Rollstuhl-Zuggerät)?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Is it possible to store bulky equipment at the cloakroom, e.g. wheelchair traction device?',
                },
              },
            ],
            data: {
              key: 'foyer.foyer.cloakroomService',
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
                  name: 'Gibt es hier Toiletten?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Are there any restrooms?',
                },
              },
            ],
            data: {
              key: 'foyer.restroom.restroomAccess',
              options: [
                {
                  value: 'outdoorToilette',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Außentoilette (z.B. bei Festivals)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'outdoor toilette',
                      },
                    },
                  ],
                },
                {
                  value: 'freelyAccessible',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'WC frei zugänglich',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'restroom freely accessible',
                      },
                    },
                  ],
                },
                {
                  value: 'accessOnDemand',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'WC-Zugang auf Anfrage',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'restroom access on demand',
                      },
                    },
                  ],
                },
                {
                  value: 'accessibleToilet',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'auf Barrierefreiheit geprüftes WC vorhanden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'has accessible toilet',
                      },
                    },
                  ],
                },
                {
                  value: 'withEurokey',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'zugänglich mit Euroschlüssel',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'accessible with Euro-key',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'foyer.restroom.restroomLocation',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Wo befindet sich die Toilette?',
                  placeholder: 'Ortsbeschreibung, z.B. Erdgeschoss, links neben der Kasse',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Where is the restroom located?',
                  placeholder:
                    'Please describe the location, e.g. first floor, to the left of the info desk',
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
                  name: 'Wie gelangt man in die Toilette?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'How do visitors enter the restroom?',
                },
              },
            ],
            data: {
              key: 'foyer.restroom.restroomDoor',
              options: [
                {
                  value: 'toOutside',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tür öffnet nach außen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'door opens to outside',
                      },
                    },
                  ],
                },
                {
                  value: 'toInside',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tür öffnet nach innen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'door opens to inside',
                      },
                    },
                  ],
                },
                {
                  value: 'bothDirections',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tür öffnet in beide Richtungen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'door opens in both directions',
                      },
                    },
                  ],
                },
                {
                  value: 'automatically',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tür öffnet automatisch (Taste)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'door opens automatically (via button)',
                      },
                    },
                  ],
                },
                {
                  value: 'narrowEntrance',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'schmale Tür (Breite weniger als 90 cm)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'narrow entrance (less than 90 cm)',
                      },
                    },
                  ],
                },
                {
                  value: 'highThreshold',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Türschwelle höher als 2 cm',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'threshold is higher than 2 cm',
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
                  name:
                    'Sind die Innenbereiche (inkl. Waschbecken, Handtrockner, etc.) per Rollstuhl erreichbar?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Is the interior (incl. washbasin, hand dryer, etc.) accessible by wheelchair?',
                },
              },
            ],
            data: {
              key: 'foyer.restroom.accessibleWithWheelchair',
              options: [
                {
                  value: 'enoughTurningSpace',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'überall genug Fläche zum Wenden (150x150 cm)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'enough turning space everywhere (150x150cm)',
                      },
                    },
                  ],
                },
                {
                  value: 'insufficientTurningSpace',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'nicht überall genug Fläche zum Wenden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'space partially insufficient for turning with a wheelchair',
                      },
                    },
                  ],
                },
                {
                  value: 'handDrierAccessible',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Handtrockner in Rollstuhlhöhe (mx. 80 cm)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'hand drier accessible from wheelchair (max. 80 cm)',
                      },
                    },
                  ],
                },
                {
                  value: 'washbasinAccessible',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Waschbecken in Rollstuhlhöhe (max. Höhe 80 cm)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'washbasin at wheelchair height (max. height 80 cm)',
                      },
                    },
                  ],
                },
                {
                  value: 'navigatableUnderSink',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Waschbecken unterfahrbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'wheelchair can navigate under a sink',
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
                  name: 'Welche der folgenden Punkte erfüllt das WC?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Which of the following aspects apply for the WC?',
                },
              },
            ],
            data: {
              key: 'foyer.toilet.toiletDetails',
              options: [
                {
                  value: 'heightOfBase',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'WC-Sitz 46 - 48 cm über Fußboden',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'WC seat 46 - 48 cm above floor',
                      },
                    },
                  ],
                },
                {
                  value: 'heightAdjustable',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'WC höhenverstellbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'WC height adjustable',
                      },
                    },
                  ],
                },
                {
                  value: 'spaceOnBackside',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit Rückenstütze (55 cm hinter Vorderkante WC)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'with back support (55 cm behind front edge WC)',
                      },
                    },
                  ],
                },
                {
                  value: 'spaceInFront',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Platz vor WC mind. 150x150cm',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'space in front of WC at least 150x150 cm',
                      },
                    },
                  ],
                },
                {
                  value: 'spaceOnUsersLeftSide',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Platz links/rechts von WC mind. 90 cm breit und 70 cm tief',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'space to the left/right at least 90cm (width) x 70 cm (depth)',
                      },
                    },
                  ],
                },
                {
                  value: 'appliances',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Toilettenpapierhalter und Spülung mit Hand / Arm bedienbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'toilet paper holder and flush operable by hand / arm',
                      },
                    },
                  ],
                },
                {
                  value: 'noFoldingHandles',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Haltegriffe sind fest, nicht einklappbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'with handles, do not retract',
                      },
                    },
                  ],
                },
                {
                  value: 'hasFoldingHandles',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Haltegriffe, bei Bedarf wegklappbar',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'with handels, can be folded away',
                      },
                    },
                  ],
                },
                {
                  value: 'emergencyWC',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Notrufanlage in WC-Nähe',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'emergency call system close to WC',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'foyer.toilet.restroomInfo',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Haben Sie hierzu noch Anmerkungen?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Would you like to add a comment?',
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Unterwegs im Gebäude',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'Getting around',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name:
                'Orientierung - Welche Hilfestellungen gibt es für die Bewegung durchs Gebäude?',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Orientation - How does the location support movement on site?',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'visuelle Hilfsmittel',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'visual aids',
                },
              },
            ],
            data: {
              key: 'orientation.wayfinding.visualAids',
              options: [
                {
                  value: 'readableSignage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Beschilderungen mit gut lesbarer Schrift (Größe und Farbkontrast)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'signage with easily readable lettering (size and colour contrast)',
                      },
                    },
                  ],
                },
                {
                  value: 'highContrastStrips',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'kontrastreiche Leitstreifen zur Wegeführung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'guidance system with high-contrast guide strips',
                      },
                    },
                  ],
                },
                {
                  value: 'pictorialGuidance',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'durchgängiges bildhaftes Leitsystem (z.B. Fußabdrücke als Bodenaufkleber)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'pictorial guidance system (e.g., footprints as floor stickers).',
                      },
                    },
                  ],
                },
                {
                  value: 'highlightedPathways',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Piktogramme zeigen Weg zu Fahrstühlen, WC etc.',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'pictograms highlight pathways to elevator, WC, etc.',
                      },
                    },
                  ],
                },
                {
                  value: 'positionOfMediaContent',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Position von Hörinhalten / Videoinhalten ist gekennzeichnet (z.B. mit Piktogrammen)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'position of audio content / video content is marked (e.g. with pictograms)',
                      },
                    },
                  ],
                },
                {
                  value: 'doorsAndPassagesContrast',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Türen und Durchgänge heben sich von Umgebung ab (z.B. farblich)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'Essential doors and passages are visually rich in contrast (e.g. by colour)',
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
                  name: 'akustische Hilfsmittel',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'acoustic aids',
                },
              },
            ],
            data: {
              key: 'orientation.wayfinding.acousticAids',
              options: [
                {
                  value: 'rfidAudioDescription',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'automatisch auslösende Audiobeschreibung per RFID',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audio description start automatically via RFID',
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
                  name: 'taktile Hilfsmittel',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Hinweis- und Warnsignale',
                },
              },
            ],
            data: {
              key: 'orientation.wayfinding.tactileAids',
              options: [
                {
                  value: 'tactilelyDetectablableSignage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Beschilderung taktil erfassbar (z.B. Reliefschrift, Braille)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'signage is tactilely detectable (braille, prismatic font)',
                      },
                    },
                  ],
                },
                {
                  value: 'tactileWallFloorGuidance',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'taktiles Wand- oder Bodenleitsystem',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'tactile wall or floor guidance system',
                      },
                    },
                  ],
                },
                {
                  value: 'handrailIndicator',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Treppenhandläufe mit ertastbarer Richtungsanzeige bzw. Etageninformation',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'handrails with tactile direction indicator or floor information',
                      },
                    },
                  ],
                },
                {
                  value: 'tactileMaps',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tast-/Reliefpläne',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'tactile maps',
                      },
                    },
                  ],
                },
                {
                  value: 'brailleMaps',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Karten / Lagepläne auch in Braille / Profilschrift',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'maps / site plans in braille',
                      },
                    },
                  ],
                },
                {
                  value: 'tactilelyDetectable',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Bedienelemente lassen sich ertasten (z.B. Türöffner)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'controlls are tactilely detectable (e.g. door openers)',
                      },
                    },
                  ],
                },
                {
                  value: 'floorCoveringIndicator',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Bodenbeläge kennzeichnen Gebäudeabschnitte (z.B. Hinweis auf wichtige Exponate)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'floor coverings indicate various building sections',
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
                  name: 'Hinweis- und Warnsignale',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'signaling and alarms',
                },
              },
            ],
            data: {
              key: 'orientation.wayfinding.signalingAndAlarms',
              options: [
                {
                  value: 'escapeRouteFinding',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Fluchtwege verschiedentlich wahrnehmbar (z.B. visuell und taktil)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'escape routes can be perceived in various ways (e.g. visually and tactilely)',
                      },
                    },
                  ],
                },
                {
                  value: 'warningSignalsFinding',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Warnsignale verschiedentlich wahrnehmbar (z.B. akustisch und optisch beim Schließen von Türen)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'warning signals address at least two senses (e.g. closing doors with visual and acoustic signals)',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'orientation.lightInfo.lighting',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Beleuchtung - Wie steht es um die Lichtverhältnisse in diesem Gebäudeabschnitt (z.B. dunkle, flimmernde oder blendende Bereiche)?',
                  placeholder: 'z.B. Ausstellungsraum mit starker Abdunklung',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Lighting - How are the lighting conditions in this area / floor (e.g., dark, flickering, or glaring areas)?',
                  placeholder: 'e.g. exhibition room with dark sections',
                },
              },
            ],
          },
        ],
      },
      // {
      //   translations: [
      //     {
      //       attributes: {
      //         language: Language.de,
      //         name:
      //           'Raumzugänge - Wie gelangt man in die wichtigsten Bereiche des Gebäudes und wie sind sie beschaffen?',
      //       },
      //     },
      //     {
      //       attributes: {
      //         language: Language.en,
      //         name:
      //           'Room access - How do you get to the main areas of the building and how do they look like?',
      //       },
      //     },
      //   ],
      //   children: [
      //     {
      //       type: AccessibilityFieldType.input,
      //       data: {
      //         key: 'orientation.indoorRoomAccess.rooms',
      //         type: InputType.text,
      //       },
      //       translations: [
      //         {
      //           attributes: {
      //             language: Language.de,
      //             name: 'Name / Bezeichnung',
      //             placeholder: 'z.B. 1. OG / Sonderausstellungsfläche',
      //           },
      //         },
      //         {
      //           attributes: {
      //             language: Language.en,
      //             name: 'e.g. 1st floor / temporary exhibitions',
      //           },
      //         },
      //       ],
      //     },
      //     {
      //       type: AccessibilityFieldType.checkboxList,
      //       translations: [
      //         {
      //           attributes: {
      //             language: Language.de,
      //             name: 'Zugangsart',
      //           },
      //         },
      //         {
      //           attributes: {
      //             language: Language.en,
      //             name: 'Type for access',
      //           },
      //         },
      //       ],
      //       data: {
      //         key: 'orientation.indoorRoomAccess.entranceType',
      //         options: [
      //           {
      //             value: 'groundLevelEntrance',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'ebenerdiger Zugang',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'ground-level entrance',
      //                 },
      //               },
      //             ],
      //           },
      //           {
      //             value: 'doors',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'Türen',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'doors',
      //                 },
      //               },
      //             ],
      //           },
      //           {
      //             value: 'stairs',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'Treppen',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'stairs',
      //                 },
      //               },
      //             ],
      //           },
      //           {
      //             value: 'elevator',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'Fahrstuhl',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'elevator',
      //                 },
      //               },
      //             ],
      //           },
      //           {
      //             value: 'ramp',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'Rampe',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'ramp',
      //                 },
      //               },
      //             ],
      //           },
      //           {
      //             value: 'lift',
      //             translations: [
      //               {
      //                 attributes: {
      //                   language: Language.de,
      //                   name: 'Treppenlift / Hublift',
      //                 },
      //               },
      //               {
      //                 attributes: {
      //                   language: Language.en,
      //                   name: 'stair lift / hoist lift',
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ],
  },

  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Im Programm- / Veranstaltungsbereich',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'In the programme / event area',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Räume mit Bestuhlung',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Rooms with seating',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Welche Services sind vor Ort für Menschen mit Behinderung / Beeinträchtigung vorhanden?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'What services are available on site for people with disabilities / impairments?',
                },
              },
            ],
            data: {
              key: 'offerArea.seating.preferentialSeating',
              options: [
                {
                  value: 'reservableWheelchairSeats',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Plätze für Rollstuhlnutzer:innen, reservierungspflichtig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'seats for wheelchair users, reservable',
                      },
                    },
                  ],
                },
                {
                  value: 'nonReservableWheelchairSeats',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Plätze für Rollstuhlnutzer:innen, nicht reservierungspflichtig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'seats for wheelchair users, not reservable',
                      },
                    },
                  ],
                },
                {
                  value: 'placedTogether',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Rollstuhlnutzer:innen werden gemeinsam mit Begleitpersonen platziert',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'accompanying persons be placed together with wheelchair users',
                      },
                    },
                  ],
                },
                {
                  value: 'beanbagSeats',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Sitzsackplätze',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'beanbag seats available',
                      },
                    },
                  ],
                },
                {
                  value: 'impairmentSeats',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Plätze für Menschen mit Seh- oder Hörbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'designated seats for inviduals with visual or hearing impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'earlyBoarding',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Early boarding möglich',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'early boarding possible',
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
              name:
                'Gibt es vor Ort feste Services oder besondere Infrastrukturen, die das Kulturerlebnis unterstützen?',
              tooltip: {
                content: [
                  'Eine Option nicht dabei? Meldet euch bei uns unter hallo@kulturdaten.berlin',
                ],
              },
            },
          },
          {
            attributes: {
              language: Language.en,
              name:
                'Are there regular services or special infrastructure that support the visiting experience?',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Aufführungen, Installationen & Exponate',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Exhibits & installations',
                },
              },
            ],
            data: {
              key: 'offerArea.mediaAid.mediaOffer',
              options: [
                {
                  value: 'hearingLoopSystem',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Audiosignale für Hörgeräte / induktive Höranlage',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'equipped with a hearing loop system',
                      },
                    },
                  ],
                },
                {
                  value: 'openCaptionsStage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Bühne mit Übertiteln zum Mitlesen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'stage with open captions',
                      },
                    },
                  ],
                },
                {
                  value: 'kneesUnderAccess',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'unterfahrbare / höhenverstellbare Vitrinen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          "display cases with adjustable height / 'knees-under' access (hollow underneath)",
                      },
                    },
                  ],
                },
                {
                  value: 'captions',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Videoinstallationen mit Untertiteln',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'video installations with captions',
                      },
                    },
                  ],
                },
                {
                  value: 'tactileModels',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tastmodelle und berührbare Exponate',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'tactile models and hands-on-exhibits',
                      },
                    },
                  ],
                },
                {
                  value: 'smellingStation',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Riechstationen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'scent / smelling station',
                      },
                    },
                  ],
                },
                {
                  value: 'hearingStations',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Hörstationen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'hearing stations',
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
                  name: 'Informationsvermittlung',
                  // tooltip:
                  //   'Immer wenn zusätzliche Geräte & Multimedia-Anwendungen zum Einsatz kommen, gibt es natürlich weitere Anforderungen an die Bedienung. Tipps z.B. zur Gestaltung von Audioguides hat u.a. der Deutsche Museumsbund gesammelt: https://www.museumsbund.de/wp-content/uploads/2017/03/dmb-barrierefreiheit-digital-160728.pdf',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Info materials',
                  // tooltip: 'Whenever additional devices & multimedia applications are used, they should be easy to operate. Tips e.g. on the design of audioguides have been collected by the German Museums Association, among others: https://www.museumsbund.de/wp-content/uploads/2017/03/dmb-barrierefreiheit-digital-160728.pdf)',
                },
              },
            ],
            data: {
              key: 'offerArea.mediaAid.infoMaterials',
              options: [
                {
                  value: 'audioguideForBlind',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Audioguide für Blinde / Menschen mit Sehbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audioguide for blind people / people with visual impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'mediaGuideEasyLanguage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Audio-/Mediaguide in Leichter Sprache',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audio-/ mediaguide in Easy Language (Leichte Sprache)',
                      },
                    },
                  ],
                },
                {
                  value: 'mediaGuideGermanSign',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Video-/Mediaguide mit Deutscher Gebärdensprache',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'video-/ mediaguide with German sign language',
                      },
                    },
                  ],
                },
                {
                  value: 'videoScreensGermanSign',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Videomonitore mit Deutscher Gebärdensprache',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'video screens with German sign language',
                      },
                    },
                  ],
                },
                {
                  value: 'infoTextsLarge',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Infotexte in Großdruck',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'info texts in large print',
                      },
                    },
                  ],
                },
                {
                  value: 'infoTextsBraille',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Infotexte auch in Braille / Reliefschrift',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'info texts in braille / prismatic font',
                      },
                    },
                  ],
                },
                {
                  value: 'infoTextsEasyLanguage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Infotexte auch in Leichter Sprache',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'info texts also available in Easy Language (Leichte Sprache)',
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
                  name: 'Recherchieren & Arbeiten',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Research & work',
                },
              },
            ],
            data: {
              key: 'offerArea.mediaAid.researchWork',
              options: [
                {
                  value: 'tactileBooks',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'taktile Bücher',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'tactile books',
                      },
                    },
                  ],
                },
                {
                  value: 'brailleBooks',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Bücher in Braille',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'books in braille',
                      },
                    },
                  ],
                },
                {
                  value: 'mediaLargePrint',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Medien in Großdruck',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'books and other media in large print',
                      },
                    },
                  ],
                },
                {
                  value: 'audioVersions',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Hörbücher, Hörzeitungen und -zeitschriften e',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audio versions of books, newspapers, magazines',
                      },
                    },
                  ],
                },
                {
                  value: 'heightAdjustable',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Höhenverstellbare Lese- und Computerplätze',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'height-adjustable tables and PC workstations',
                      },
                    },
                  ],
                },
                {
                  value: 'accessibleComputer',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name:
                          'Computer mit barrierefreier Software und Bedienhilfen (z.B. adaptive Tastatur)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name:
                          'computer with accessible software and operating aids (e.g. adaptive keyboard).',
                      },
                    },
                  ],
                },
                {
                  value: 'visuallyImpairedComputer',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'PC für Blinde / Menschen mit Sehbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'PC workstations for visually impaired / blind individuals',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: AccessibilityFieldType.textarea,
            data: {
              key: 'offerArea.mediaAid.mediaInfo',
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkung',
                  placeholder:
                    'z.B. Informationsmaterial in Leichter Sprache kann an der Kasse ausgeliehen werden',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Your comment',
                  placeholder:
                    'e.g. visitor guide is available in large print and braille from the lobby information desk',
                },
              },
            ],
          },
        ],
      },
    ],
  },

  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Erholung & nach dem Besuch',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'Relaxation & after the visit',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: '',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: '',
            },
          },
        ],
        children: [
          {
            type: AccessibilityFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Gibt es im Gebäude spezielle Rückzugsmöglichkeiten?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Are there any facilities or areas in the building for rest or relaxation?',
                },
              },
            ],
            data: {
              key: 'afterVisit.relaxation',
              options: [
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
                        name: 'rooms or resting zones with possibility to sit or lie down',
                      },
                    },
                  ],
                },
                {
                  value: 'seatingFacilities',
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
                  value: 'childrenPlayArea',
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
                  value: 'loudConversations',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Räume für laute Unterhaltungen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'rooms or areas for loud conversations',
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
              key: 'afterVisit.sensoryMap',
              type: InputType.url,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name:
                    'Können sich Besucher:innen vorab über laute oder belebte Bereiche des Ortes informieren - z.B. in einer Sensory Map?',
                  placeholder: 'https://example.com',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Do you have a sensory map - a plan of loud or usually very busy parts of the building?',
                  placeholder: 'https://example.com',
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
                  name:
                    'Restaurant / Bar / Café - Sind Essensausgabe, Kassen und Esstische mit Rollstuhl erreichbar?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Restaurant / bar / café - Are the food counter, cash registers and dining tables accessible with a wheelchair?',
                },
              },
            ],
            data: {
              key: 'afterVisit.accessibleFoodPlaces',
              options: [
                {
                  value: 'completely',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'vollständig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'completely',
                      },
                    },
                  ],
                },
                {
                  value: 'partially',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'teilweise',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'partially',
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
                        name: 'gar nicht',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'not at all',
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
                  name: 'Welche Unterstützung gibt es bei der Nutzung?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'What support is available?',
                },
              },
            ],
            data: {
              key: 'afterVisit.support',
              options: [
                {
                  value: 'adjustableTables',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'höhenverstellbare Tische',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'height-adjustable tables',
                      },
                    },
                  ],
                },
                {
                  value: 'variousHeights',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Tische mit unterschiedlichen Höhen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'tables of various height',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchairsTables',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'ausgewiesene Plätze für Rollstuhlfahrer:innen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'designated tables / areas for wheelchairs',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchairsAreas',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'ausgewiesene Plätze für Rollstuhlfahrer:innen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'designated tables / areas for wheelchairs',
                      },
                    },
                  ],
                },
                {
                  value: 'tableService',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit Bedienung / Assistenz für die Essensausgabe',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'table service / assistance available',
                      },
                    },
                  ],
                },
                {
                  value: 'photoMenus',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Menüs mit Bildern versehen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'menu with photos of dishes',
                      },
                    },
                  ],
                },
                {
                  value: 'brailleMenus',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Menüs mit Braille',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'menu in braille',
                      },
                    },
                  ],
                },
                {
                  value: 'visibleFood',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Speisen sind sichtbar präsentiert',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'food is visible',
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
                  name:
                    'Feedback - Wie können Menschen mit Behinderung / Beeinträchtigung euch ihre Besuchseindrücke schildern oder Anregungen geben?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name:
                    'Feedback - How can people with disabilities / impairments give you feedback or suggestions regarding their visit?',
                },
              },
            ],
            data: {
              key: 'afterVisit.feedback',
              options: [
                {
                  value: 'visitorServiceContact',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kontakt Besuchsdienste ( Telefon / Mail)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'contact our visitor service (email / telephone)',
                      },
                    },
                  ],
                },
                {
                  value: 'socialMedia',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Social Media-Kanäle des/der Veranstalter:in',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'leave a message in our social media channels',
                      },
                    },
                  ],
                },
                {
                  value: 'feedbackSheets',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Rückmeldezettel / Fragebogen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'feedback sheets / questionnaire available on site',
                      },
                    },
                  ],
                },
                {
                  value: 'accessibleGuestBook',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'barrierefreies Gästebuch',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'accessible guest book available on site',
                      },
                    },
                  ],
                },
                {
                  value: 'onlineContactForm',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kontaktformular auf Website',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'contact form on our website',
                      },
                    },
                  ],
                },
                {
                  value: 'onlineChatbot',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Chatbot auf Website',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'chatbot on our website',
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
                  name: 'Ist der Shop mit einem Rollstuhl befahrbar?',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Is the shop accessible with a wheelchair?',
                },
              },
            ],
            data: {
              key: 'afterVisit.shopInfo',
              options: [
                {
                  value: 'completely',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'vollständig',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'completely',
                      },
                    },
                  ],
                },
                {
                  value: 'partially',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'teilweise',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'partially',
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
                        name: 'gar nicht',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'not at all',
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
