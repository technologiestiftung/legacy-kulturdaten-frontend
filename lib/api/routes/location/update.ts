import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Location } from '../../types/location';

/**
 * /auth/info
 */

export type LocationUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Location;
  };
  response: {
    status: 200;
    body: {
      data: Location;
      meta: {
        message: 'Location updated successfully';
      };
    };
  };
};

export const locationUpdateFactory = (
  token: LocationUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    entry: Location;
  }
): LocationUpdate => ({
  request: {
    route: apiRoutes.locationUpdate({ id: query.id }),
    method: 'PATCH',
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
