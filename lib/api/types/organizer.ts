import { Language } from '../../../config/locale';
import { Address } from './address';
import { DefaultAttributes, Translation } from './general';
import { WebLink } from './webLink';

type OrganizerTypeTranslation = {
  attributes: {
    language: Language;
    name: string;
  };
} & Translation;

type OrganizerSubjectTranslation = OrganizerTypeTranslation;

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
};

export type CreateOrganizer = {
  relations?: {
    links?: string[];
    translations?: OrganizerTranslation[];
    address?: Address;
    types?: number[];
    subjects?: number[];
  };
};
