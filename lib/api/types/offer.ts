import { Language } from '../../../config/locale';
import { CategoryEntry, DefaultAttributes, Translation } from './general';

export enum OfferMode {
  permanent = 'permanent',
  scheduled = 'scheduled',
}

export enum OfferDateStatus {
  scheduled = 'scheduled',
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
    id?: number;
    type?: 'offerdate';
    attributes?: {
      startsAt: string;
      endsAt: string;
      isAllDay: boolean;
      status: OfferDateStatus;
      ticketUrl?: string;
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
    attributes?: {
      mode?: OfferMode;
    } & DefaultAttributes;
    relations?: {
      translations: OfferTranslation[];
      dates?: OfferDate['data'][];
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
