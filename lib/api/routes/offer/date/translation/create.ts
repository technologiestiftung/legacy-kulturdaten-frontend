import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../../..';
import { Language } from '../../../../../../config/locale';
import { OfferDateTranslation } from '../../../../types/offer';

/**
 * /auth/info
 */

export type OfferDateTranslationCreate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: OfferDateTranslation;
  };
  response: {
    status: 200;
    body: {
      data: OfferDateTranslation;
      meta: {
        language: Language;
      };
    };
  };
};

export const offerDateTranslationCreateFactory = (
  token: OfferDateTranslationCreate['request']['headers']['Authorization'],
  query: {
    offerId: string;
    dateId: number;
    translation: OfferDateTranslation;
  }
): OfferDateTranslationCreate => ({
  request: {
    route: apiRoutes.offerDateTranslationCreate({
      offerIid: query.offerId,
      dateId: String(query.dateId),
    }),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.translation,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
