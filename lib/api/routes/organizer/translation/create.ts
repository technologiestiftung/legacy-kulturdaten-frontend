import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Language } from '../../../../../config/locale';
import { OrganizerTranslation } from '../../../types/organizer';

/**
 * /auth/info
 */

export type OrganizerTranslationCreate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: OrganizerTranslation;
  };
  response: {
    status: 200;
    body: {
      data: OrganizerTranslation;
      meta: {
        language: Language;
      };
    };
  };
};

export const organizerTranslationCreateFactory = (
  token: OrganizerTranslationCreate['request']['headers']['Authorization'],
  query: {
    id: string;
    translation: OrganizerTranslation;
  }
): OrganizerTranslationCreate => ({
  request: {
    route: apiRoutes.organizerTranslationCreate({
      organizer: query.id,
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
