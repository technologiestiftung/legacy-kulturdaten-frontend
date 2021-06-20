import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Language } from '../../../../../config/locale';
import { OrganizerTranslation } from '../../../types/organizer';

/**
 * /auth/info
 */

export type OrganizerTranslationUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
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

export const organizerTranslationUpdateFactory = (
  token: OrganizerTranslationUpdate['request']['headers']['Authorization'],
  query: {
    organizerId: string;
    translationId: number;
    organizerTranslation: OrganizerTranslation;
  }
): OrganizerTranslationUpdate => ({
  request: {
    route: apiRoutes.organizerTranslationUpdate({
      organizerId: query.organizerId,
      translationId: String(query.translationId),
    }),
    method: 'PATCH',
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
