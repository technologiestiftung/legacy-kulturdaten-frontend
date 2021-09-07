import { Language } from '../../../config/locale';
import { CategoryEntry, DefaultAttributes, Translation } from './general';

export enum OfferDateStatus {
  confirmed = 'confirmed',
  cancelled = 'cancelled',
}

export type OfferDateTranslation = {
  type: 'offerdatetranslation';
  attributes: {
    language: Language;
    name?: string;
    room?: string;
  };
} & Translation;

export type OfferDate = {
  data: {
    id?: string;
    type?: 'offerdate';
    attributes?: {
      from: string;
      to: string;
      allDay: boolean;
      status: OfferDateStatus;
      ticketLink?: string;
      recurrence?: string;
    };
    relations?: {
      translations: OfferDateTranslation[];
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
    attributes?: DefaultAttributes;
    relations?: {
      translations: OfferTranslation[];
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
