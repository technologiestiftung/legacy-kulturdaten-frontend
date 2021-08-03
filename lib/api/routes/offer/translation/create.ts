import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Language } from '../../../../../config/locale';
import { OfferTranslation } from '../../../types/offer';

/**
 * /auth/info
 */

export type OfferTranslationCreate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: OfferTranslation;
  };
  response: {
    status: 200;
    body: {
      data: OfferTranslation;
      meta: {
        language: Language;
      };
    };
  };
};

export const offerTranslationCreateFactory = (
  token: OfferTranslationCreate['request']['headers']['Authorization'],
  query: {
    id: string;
    translation: OfferTranslation;
  }
): OfferTranslationCreate => ({
  request: {
    route: apiRoutes.offerTranslationCreate({
      id: query.id,
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
