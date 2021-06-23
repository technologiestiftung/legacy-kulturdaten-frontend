import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Organizer, CreateOrganizer } from '../../types/organizer';

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
    body: CreateOrganizer;
  };
  response: {
    status: 200;
    body: Organizer;
  };
}

export const organizerCreateFactory: ApiCallFactory = (
  token: OrganizerCreate['request']['headers']['Authorization'],
  query: { organizer: CreateOrganizer }
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
