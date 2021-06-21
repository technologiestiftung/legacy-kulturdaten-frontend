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

export const OrganizerTranslationCreateFactory = (
  token: OrganizerTranslationCreate['request']['headers']['Authorization'],
  query: {
    organizerId: string;
    organizerTranslation: OrganizerTranslation;
  }
): OrganizerTranslationCreate => ({
  request: {
    route: apiRoutes.OrganizerTranslationCreate({
      organizerId: query.organizerId,
    }),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.organizerTranslation,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
