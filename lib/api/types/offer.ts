import { Language } from '../../../config/locale';
import { CategoryEntry, DefaultAttributes, Translation } from './general';
import { Link } from './link';
import { Location } from './location';
import { Organizer } from './organizer';
import {
  EntrySubject,
  EntrySubjectTranslation,
  EntryType,
  EntryTypeTranslation,
} from './typeSubject';

export type OfferType = EntryType;
export type OfferSubject = EntrySubject;
export type OfferMainType = EntryType;
export type OfferTypeTranslation = EntryTypeTranslation;
export type OfferSubjectTranslation = EntrySubjectTranslation;

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
    teaser?: string;
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
      registrationUrl?: string;
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
    roomDescription?: string;
  };
} & Translation;

export type Offer = {
  data: {
    id?: string;
    type?: 'offer';
    attributes?: {
      hasFee?: boolean;
      needsRegistration?: boolean;
      ticketUrl?: string;
      registrationUrl?: string;
      isPermanent?: boolean;
    } & DefaultAttributes;
    relations?: {
      dates?: OfferDate['data'][];
      links?: Link[];
      location?: Location['data'][] | string[];
      organizers?: Organizer['data'][] | string[];
      subjects?: OfferSubject[];
      translations: OfferTranslation[];
      types?: OfferType[];
      mainType?: OfferMainType[];
    } & CategoryEntry['data']['relations'];
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
