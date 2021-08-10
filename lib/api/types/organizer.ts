import { Language } from '../../../config/locale';
import { Address } from './address';
import { CategoryEntry, DefaultAttributes, Translation } from './general';
import { WebLink } from './webLink';

export type OrganizerTypeTranslation = {
  attributes: {
    language: Language;
    name: string;
  };
} & Translation;

export type OrganizerSubjectTranslation = OrganizerTypeTranslation;

export type OrganizerSubject = {
  type: 'organizersubject';
  id: number;
  relations?: {
    translations: OrganizerSubjectTranslation[];
  };
};

export type OrganizerType = {
  type: 'organizertype';
  id: number;
  attributes: DefaultAttributes;
  relations?: {
    translations: OrganizerTypeTranslation[];
    subjects?: OrganizerSubject[];
  };
};

export type OrganizerTranslation = {
  type: 'organizertranslation';
  attributes: {
    language?: Language;
    name: string;
    description?: string;
  };
} & Translation;

export type Organizer = {
  data: {
    type?: 'organizer';
    id?: string;
    attributes?: {
      homepage?: string;
      email?: string;
      phone?: string;
    } & DefaultAttributes;
    relations?: {
      links: WebLink[];
      address?: Address;
      subjects?: OrganizerSubject[];
      translations?: OrganizerTranslation[];
      types?: OrganizerType[];
    };
  };
  meta?: {
    publishable:
      | boolean
      | {
          [key: string]: string[];
        };
  };
} & CategoryEntry;

export type CreateOrganizer = {
  relations?: {
    links?: string[];
    translations?: OrganizerTranslation[];
    address?: Address;
    types?: number[];
    subjects?: number[];
  };
};
