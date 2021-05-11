import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallBlueprint } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      Authorization: string;
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

export const organizerShowBlueprint: ApiCallBlueprint = (
  token: OrganizerCreate['request']['headers']['Authorization'],
  query: { organizer: Organizer }
): OrganizerCreate => ({
  request: {
    route: apiRoutes.organizerCreate(),
    method: 'POST',
    headers: {
      Authorization: makeBearer(token),
    },
    body: query.organizer,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
