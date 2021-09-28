import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export type OrganizerMedia = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      Authorization: string;
    };
    body: { media: FormData };
  };
  response: {
    status: 200;
    body: {
      data: Organizer;
      meta: {
        message: 'Organizer updated successfully';
      };
    };
  };
};

export const organizerMediaFactory = (
  token: OrganizerMedia['request']['headers']['Authorization'],
  query: {
    organizer: string;
    media: FormData;
  }
): OrganizerMedia => ({
  request: {
    route: apiRoutes.organizerUpdate({ organizer: query.organizer }),
    method: 'PATCH',
    headers: {
      Authorization: makeBearer(token),
    },
    body: { media: query.media },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
