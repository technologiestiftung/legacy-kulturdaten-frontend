import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Organizer;
  };
  response: {
    status: 200;
    body: {
      data: Organizer;
      meta: {
        message: 'Organizer created successfully';
      };
    };
  };
}

export const organizerCreateFactory: ApiCallFactory = (
  token: OrganizerCreate['request']['headers']['Authorization'],
  query: { organizer: Organizer }
): OrganizerCreate => ({
  request: {
    route: apiRoutes.organizerCreate(),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.organizer,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
