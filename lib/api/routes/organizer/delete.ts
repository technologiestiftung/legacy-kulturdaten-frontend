import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body?: Organizer;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Organizer deleted successfully';
      };
    };
  };
}

export const organizerDeleteFactory = (
  token: OrganizerDelete['request']['headers']['Authorization'],
  query: { id: string; entry: Organizer }
): OrganizerDelete => ({
  request: {
    route: apiRoutes.organizerDelete({ organizer: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.entry,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
