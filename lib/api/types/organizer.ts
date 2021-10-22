import { Language } from '../../../config/locale';
import { Address } from './address';
import { Contact } from './contact';
import { CategoryEntry, DefaultAttributes, Translation } from './general';
import { Media } from './media';
import { Role, RoleName } from './role';
import { Tag } from './tag';
import {
  EntrySubject,
  EntrySubjectTranslation,
  EntryType,
  EntryTypeTranslation,
} from './typeSubject';
import { WebLink } from './webLink';

export type OrganizerType = EntryType;
export type OrganizerSubject = EntrySubject;
export type OrganizerTypeTranslation = EntryTypeTranslation;
export type OrganizerSubjectTranslation = EntrySubjectTranslation;

export type OrganizerRolePending = {
  id: string;
  attributes: {
    role: RoleName;
    email: string;
    isActive?: boolean;
  };
};

export type OrganizerRole = Role | OrganizerRolePending;

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
      links?: WebLink[];
      address?: Address;
      subjects?: OrganizerSubject[];
      translations?: OrganizerTranslation[];
      types?: OrganizerType[];
      media?: Media['data'][];
      logo?: Media['data'];
      tags?: Tag[];
      contacts?: Contact[];
      roles?: OrganizerRole[];
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
