import { Language } from '../../../config/locales';
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
      expiresAt: string;
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
