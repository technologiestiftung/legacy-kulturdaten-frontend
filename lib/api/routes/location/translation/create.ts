import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Language } from '../../../../../config/locale';
import { LocationTranslation } from '../../../types/location';

/**
 * /auth/info
 */

export type LocationTranslationCreate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: LocationTranslation;
  };
  response: {
    status: 200;
    body: {
      data: LocationTranslation;
      meta: {
        language: Language;
      };
    };
  };
};

export const locationTranslationCreateFactory = (
  token: LocationTranslationCreate['request']['headers']['Authorization'],
  query: {
    id: string;
    translation: LocationTranslation;
  }
): LocationTranslationCreate => ({
  request: {
    route: apiRoutes.locationTranslationCreate({
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
