import { Language } from 'rrule/dist/esm/src/nlp/i18n';
import { CategoryEntry, Translation } from './general';

export type MediaTranslation = {
  attributes: {
    language: Language;
    alternativeText: string;
  };
} & Translation;

export type Media = {
  data: {
    id: number;
    type: 'media';
    attributes: {
      url: string;
      width: number;
      height: number;
      filesize: number | null;
      format: string;
      copyright: string;
      license: string;
      createdAt: string;
      updatedAt: string;
    };
    relations: {
      translations: MediaTranslation[];
      renditions?: [
        {
          id: number;
          type: 'rendition';
          attributes: {
            width: number;
            height: number;
            filesize: number | null;
            format: string;
          };
        }
      ];
    };
  };
} & CategoryEntry;
