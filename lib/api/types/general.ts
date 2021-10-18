import { Language } from '../../../config/locale';
import { Media } from './media';
import { OfferSubject } from './offer';
import { Tag } from './tag';
import { EntrySubject } from './typeSubject';

export type Translation = {
  id?: number;
  type?: string;
  attributes: {
    name: string;
    language: Language;
  };
};

export enum PublishedStatus {
  published = 'published',
  draft = 'draft',
}

export type DefaultAttributes = {
  createdAt: string;
  updatedAt: string;
  status: PublishedStatus;
};

export type CategoryEntry = {
  data: {
    type?: string;
    id?: string;
    attributes?: DefaultAttributes;
    relations?: {
      translations?: Translation[];
      media?: Media['data'][];
      subjects?: EntrySubject[];
      types?: OfferSubject[];
      tags?: Tag[];
    };
  };
  meta?: {
    publishable: boolean | { [key: string]: string[] };
    language?: Language;
  };
};
