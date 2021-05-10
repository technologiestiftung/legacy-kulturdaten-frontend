import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    status: 200;
    body: {
      data: Organizer[];
    };
  };
}

export const organizerListBlueprint = (
  token: OrganizerList['request']['headers']['Authorization']
): OrganizerList => ({
  request: {
    route: apiRoutes.organizerList(),
    method: 'GET',
    headers: {
      Authorization: makeBearer(token),
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
