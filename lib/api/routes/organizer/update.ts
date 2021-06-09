import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Address } from '../../types/address';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export type OrganizerUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: {
      attributes: {
        name: string;
        address: Address['attributes'];
      };
      type?: string;
      subjects?: string[];
    };
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

export const organizerUpdateFactory = (
  token: OrganizerUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    organizer: {
      attributes: {
        name: string;
        address: Address['attributes'];
      };
      type?: string;
      subjects?: string[];
    };
  }
): OrganizerUpdate => ({
  request: {
    route: apiRoutes.organizerUpdate({ id: query.id }),
    method: 'PATCH',
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
