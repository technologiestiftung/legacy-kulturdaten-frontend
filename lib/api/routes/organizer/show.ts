import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerShow extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      Authorization: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: Organizer;
    };
  };
}

export const organizerShowFactory = (
  token: OrganizerShow['request']['headers']['Authorization'],
  query: { organizer: string }
): OrganizerShow => ({
  request: {
    route: apiRoutes.organizerShow({ organizer: query.organizer }),
    method: 'GET',
    headers: {
      Authorization: makeBearer(token),
    },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
