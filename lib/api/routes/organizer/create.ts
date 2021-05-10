import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
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

export const organizerShowBlueprint = (
  token: OrganizerCreate['request']['headers']['Authorization'],
  organizer: Organizer
): OrganizerCreate => ({
  request: {
    route: apiRoutes.organizerCreate(),
    method: 'POST',
    headers: {
      Authorization: makeBearer(token),
    },
    body: organizer,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
