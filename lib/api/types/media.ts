import { Language } from '../../../config/locales';
import { CategoryEntry, Translation } from './general';

export type RenditionAttributes = {
  width: number;
  height: number;
  filesize: string | null;
  format: string;
  url: string;
};

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
      copyright: string;
      license: string;
      expiresAt: string;
      createdAt: string;
      updatedAt: string;
    } & RenditionAttributes;
    relations: {
      translations: MediaTranslation[];
      renditions?: [
        {
          id: number;
          type: 'rendition';
          attributes: RenditionAttributes;
        }
      ];
    };
  };
} & CategoryEntry;
