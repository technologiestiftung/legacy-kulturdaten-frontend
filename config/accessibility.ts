import { InputType } from '../components/input';
import { AccessibilityCategory, AccessibilityFieldType } from '../lib/accessibility';
import { Language } from './locale';

export const locationAccessibility: AccessibilityCategory[] = [
  {
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Generell',
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
                        name: "*yes, tested by 'Reisen für alle'",
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
                        name: "*yes, tested by 'Mobidat'",
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
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.entranceService.accessServiceInfo',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkung',
                  placeholder: 'Anmerkung, z.B. muss man Assistenzhunde vorher anmelden?',
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
                                'fest installierte, rollstuhlgerechte Rampe [+Info: mind. 120cm Laufbreite, max. 6 Grad Neigung]',
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
            type: AccessibilityFieldType.input,
            data: {
              key: 'planning.entry.entranceConstraints',
              type: InputType.text,
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
              type: InputType.number,
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
            type: AccessibilityFieldType.input,
            data: {
              key: 'foyer.restroom.restroomLocation',
              type: InputType.url,
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
];
