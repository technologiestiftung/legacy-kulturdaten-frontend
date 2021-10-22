import { Language } from '../../../config/locales';
import { CategoryEntry, Translation } from './general';

export type MediaLicense = {
  id: number;
  type: 'medialicense';
  attributes: {
    name: string;
    url: string;
  };
};

export type RenditionAttributes = {
  width: number;
  height: number;
  filesize: string | null;
  format: string;
  url: string;
  base: number;
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
      expiresAt: string;
      createdAt: string;
      updatedAt: string;
      acceptedTermsAt: string;
      mediaLicenseId: number;
    } & RenditionAttributes;
    relations: {
      translations: MediaTranslation[];
      license?: MediaLicense | number;
      renditions?: {
        id: number;
        type: 'rendition';
        attributes: RenditionAttributes;
      }[];
    };
  };
} & CategoryEntry;
