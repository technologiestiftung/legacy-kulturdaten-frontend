import { InputType } from '../components/input';
import {
  GenericFormCategory,
  GenericFormFieldType,
  GenericFormFieldConditionType,
} from '../lib/genericForm';
import { dinLanguages } from './dinLanguages';
import { Language } from './locale';

export const offerAudience: GenericFormCategory[] = [
  {
    collapsable: false,
    translations: [
      {
        attributes: {
          language: Language.de,
          name: 'Angaben zu Sprachoptionen und zur Zielgruppe',
        },
      },
      {
        attributes: {
          language: Language.en,
          name: 'Information on spoken languages and the audience',
        },
      },
    ],
    children: [
      {
        translations: [
          {
            attributes: {
              language: Language.de,
              name: 'Sprachoption',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Language options',
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
                  name: 'Sprache des Angebots',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Language',
                },
              },
            ],
            data: {
              key: 'planning.admissionInfo.admissionAccessibility',
              i18nKeys: {
                addButton: 'languageTags.addButton',
                addLabel: 'languageTags.addLabel',
                addPlaceholder: 'languageTags.addPlaceholder',
                listDelete: 'languageTags.listDelete',
                listLabel: 'languageTags.listLabel',
                listPlaceholder: 'languageTags.listPlaceholder',
                noMatch: 'languageTags.noMatch',
              },
              options: dinLanguages,
            },
          },
          {
            type: GenericFormFieldType.checkboxList,
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Weitere Sprachoption',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Additional language options',
                },
              },
            ],
            data: {
              key: 'languageOptions.languageAid',
              options: [
                {
                  value: 'audioDescriptionsGenerated',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit synthetischer Audiodeskription (per Software generierte Stimme)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audio descriptions available (computer-generated voice)',
                      },
                    },
                  ],
                },
                {
                  value: 'audioDescriptions',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit eingesprochener Audiodeskription (von Sprecher:innen gelesen)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'audio descriptions available',
                      },
                    },
                  ],
                },
                {
                  value: 'signedEvent',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit Deutscher Gebärdensprache (DGS)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'signed event/information in German Sign Language',
                      },
                    },
                  ],
                },
                {
                  value: 'simultaneousTranslation',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit Simultanübersetzung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'with simultaneous translation',
                      },
                    },
                  ],
                },
                {
                  value: 'easyLanguage',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Angebot auch in Leichter Sprache',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'also available in Easy Language (Leichte Sprache)',
                      },
                    },
                  ],
                },
                {
                  value: 'openCaptioning',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'mit Untertiteln (auf Bildschirm) oder Übertitel (an der Bühne)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'open captioning (on screen / above stage)',
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
                  name: 'Weitere Sprachoption',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Additional language options',
                },
              },
            ],
            condition: {
              key: 'languageOptions.languageAid',
              type: GenericFormFieldConditionType.include,
              value: 'openCaptioning',
            },
            data: {
              key: 'languageOptions.languageAid.subtitles',
              options: [
                {
                  value: 'automaticallyGenerated',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'automatisch generiert',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'automatically generated',
                      },
                    },
                  ],
                },
                {
                  value: 'captionsVideoDescription',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Erweiterte Untertitel mit Beschreibung des visuellen Geschehens',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Captions with video / scene description',
                      },
                    },
                  ],
                },
                {
                  value: 'captionsAudioDescription',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Erweiterte Untertitel mit Beschreibung von Geräuschen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Captions with sound description',
                      },
                    },
                  ],
                },
                {
                  value: 'realtimeVideoDescription',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Live-Untertitelung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'real-time video description',
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            type: GenericFormFieldType.input,
            data: {
              key: 'languageOptions.languageInfo',
              type: InputType.text,
            },
            translations: [
              {
                attributes: {
                  language: Language.de,
                  name: 'Anmerkungen',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Your comment',
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
              name: 'Zielgruppe',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Auience',
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
                  name: 'Angebot speziell für:',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Offer especially for:',
                },
              },
            ],
            data: {
              key: 'audience.audience',
              options: [
                {
                  value: 'adults',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'nur für Erwachsene (ab 18 Jahren)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'adults only (18+)',
                      },
                    },
                  ],
                },
                {
                  value: 'familyEvents',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Familien',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'family events',
                      },
                    },
                  ],
                },
                {
                  value: 'youngChildren',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Vorschulkinder (bis 6 Jahre)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'young children (up to 6 yrs)',
                      },
                    },
                  ],
                },
                {
                  value: 'kids',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Kinder (bis 13 Jahre)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'kids (6-13 yrs)',
                      },
                    },
                  ],
                },
                {
                  value: 'teens',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Jugendliche (ab 13 Jahren)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'teens (13+)',
                      },
                    },
                  ],
                },
                {
                  value: 'schoolEvents',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Schulklassen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'school events',
                      },
                    },
                  ],
                },
                {
                  value: 'students',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Studierende',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'students',
                      },
                    },
                  ],
                },
                {
                  value: 'artists',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Künstler:innen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'artists',
                      },
                    },
                  ],
                },
                {
                  value: 'groups',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Gruppen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'groups',
                      },
                    },
                  ],
                },
                {
                  value: 'blindPeople',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Blinde / Menschen mit Sehbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'blind people / people with visual impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'deafPeople',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'gehörlose Menschen / Menschen mit Hörbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'deaf people / people with hearing impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'wheelchairUsers',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Rollstuhlfahrende / Menschen mit Gehbehinderung',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'wheelchair users / people with mobility impairment',
                      },
                    },
                  ],
                },
                {
                  value: 'learningDifficulties',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Menschen mit Lernschwierigkeiten',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'people with learning difficulties',
                      },
                    },
                  ],
                },
                {
                  value: 'dementia',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Menschen mit Demenz',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'People with dementia',
                      },
                    },
                  ],
                },
                {
                  value: 'youngChildren',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Vorschulkinder (bis 6 Jahre)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'young children (up to 6 yrs)',
                      },
                    },
                  ],
                },
                {
                  value: 'youngChildren',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Vorschulkinder (bis 6 Jahre)',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'young children (up to 6 yrs)',
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
              name: 'Beinhaltet das Angebot besondere Effekte oder sensorische Reize?',
            },
          },
          {
            attributes: {
              language: Language.en,
              name: 'Does the offer include special sensory stimuli?',
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
                  name: 'Licht',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'light',
                },
              },
            ],
            data: {
              key: 'audience.stimuli.light',
              options: [
                {
                  value: 'extremeSurprising ',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'extreme, überraschend einsetzende Lichteffekte',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'extreme, surprising lighting effects',
                      },
                    },
                  ],
                },
                {
                  value: 'brightGlare',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'sehr helles/blendendes Licht',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'very bright/glare light',
                      },
                    },
                  ],
                },
                {
                  value: 'stroboscope',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Stroboskop',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'stroboscope',
                      },
                    },
                  ],
                },
                {
                  value: 'darkened',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Momente, in denen der Raum komplett abgedunkelt ist',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Moments when the room is completely darkened',
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
                  name: 'Sound',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'sound',
                },
              },
            ],
            data: {
              key: 'audience.stimuli.sound',
              options: [
                {
                  value: 'extremeSurprising ',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: '*extreme, überraschend einsetzende Soundeffekte',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'extreme, surprising sound effects',
                      },
                    },
                  ],
                },
                {
                  value: 'distortedVoices',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'verzerrte Stimmen',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'distorted voices',
                      },
                    },
                  ],
                },
                {
                  value: 'darkened',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'sehr laute Musik',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'very loud music',
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
                  name: 'Andere Effekte',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Other effects',
                },
              },
            ],
            data: {
              key: 'audience.stimuli.effects',
              options: [
                {
                  value: 'fog ',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Nebel',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'fog',
                      },
                    },
                  ],
                },
                {
                  value: 'odours',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Gerüche',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'odours',
                      },
                    },
                  ],
                },
                {
                  value: 'fire',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Feuer',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'fire',
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
                  name: 'Inhaltliche Trigger',
                },
              },
              {
                attributes: {
                  language: Language.en,
                  name: 'Content triggers',
                },
              },
            ],
            data: {
              key: 'audience.stimuli.triggers',
              options: [
                {
                  value: 'blood ',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Blut',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'blood',
                      },
                    },
                  ],
                },
                {
                  value: 'violence',
                  translations: [
                    {
                      attributes: {
                        language: Language.de,
                        name: 'Darstellung / Thematisierung von Gewalt',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Representation / thematisation of violence',
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
                        name: 'Darstellung / Thematisierung von rassistischen, sexistischen, ableistischen, queerfeindlichen oder anderen Diskriminierungserfahrungen, die möglicherweise Traumata triggern',
                      },
                    },
                    {
                      attributes: {
                        language: Language.en,
                        name: 'Presentation / thematisation of racist, sexist, ableist, queer-hostile or other discrimination experiences that may trigger trauma',
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
