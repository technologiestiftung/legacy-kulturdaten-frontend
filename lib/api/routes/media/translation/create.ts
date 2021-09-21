import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Language } from '../../../../../config/locale';
import { MediaTranslation } from '../../../types/media';

/**
 * /auth/info
 */

export type MediaTranslationCreate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: MediaTranslation;
  };
  response: {
    status: 200;
    body: {
      data: MediaTranslation;
      meta: {
        language: Language;
      };
    };
  };
};

export const mediaTranslationCreateFactory = (
  token: MediaTranslationCreate['request']['headers']['Authorization'],
  query: {
    id: string;
    translation: MediaTranslation;
  }
): MediaTranslationCreate => ({
  request: {
    route: apiRoutes.mediaTranslationCreate({
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
