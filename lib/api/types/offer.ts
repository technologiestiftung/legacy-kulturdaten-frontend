import { Language } from '../../../config/locale';
import { CategoryEntry, DefaultAttributes, Translation } from './general';
import {
  EntrySubject,
  EntrySubjectTranslation,
  EntryType,
  EntryTypeTranslation,
} from './typeSubject';

export type OfferType = EntryType;
export type OfferSubject = EntrySubject;
export type OfferTypeTranslation = EntryTypeTranslation;
export type OfferSubjectTranslation = EntrySubjectTranslation;

export enum OfferMode {
  permanent = 'permanent',
  scheduled = 'scheduled',
}

export enum OfferDateStatus {
  scheduled = 'scheduled',
  canceled = 'canceled',
  past = 'past',
}

export type OfferDateTranslation = {
  type: 'offerdatetranslation';
  attributes: {
    language: Language;
    name?: string;
    description?: string;
    roomDescription?: string;
  };
} & Translation;

export type OfferDate = {
  data: {
    id?: number;
    type?: 'offerdate';
    attributes?: {
      startsAt: string;
      endsAt: string;
      status: OfferDateStatus;
      ticketUrl?: string;
    };
    relations?: {
      translations: OfferDateTranslation[];
    };
    meta?: {
      recurrenceRule: string;
      startsAt: string;
      endsAt: string;
    };
  };
};

export type OfferTranslation = {
  type: 'offertranslation';
  attributes: {
    language: Language;
    name?: string;
    description?: string;
  };
} & Translation;

export type Offer = {
  data: {
    id?: string;
    type?: 'offer';
    attributes?: {
      mode?: OfferMode;
    } & DefaultAttributes;
    relations?: {
      translations: OfferTranslation[];
      dates?: OfferDate['data'][];
      subjects?: OfferSubject[];
      types?: OfferType[];
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

export type CreateOffer = {
  relations?: {
    translations?: OfferTranslation[];
  };
};
