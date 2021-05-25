import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Address } from '../../types/address';
import { Organizer } from '../../types/organizer';

/**
 * /auth/info
 */

export interface OrganizerUpdate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: {
      name: string;
      address: Address['attributes'];
      type?: number;
      subjects?: number[];
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
}

export const organizerUpdateFactory = (
  token: OrganizerUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    organizer: {
      name: string;
      address: Address['attributes'];
      type?: number;
      subjects?: number[];
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
    body: { ...query.organizer, type: 1, subjects: [1] },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
