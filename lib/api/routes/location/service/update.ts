import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../../..';
import { Service } from '../../../types/service';

/**
 * /location/service/update
 */

export type LocationServiceUpdate = ApiCall & {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'PATCH';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Service;
  };
  response: {
    status: 200;
    body: {
      data: Location;
      meta: {
        message: 'Location Service updated successfully';
      };
    };
  };
};

export const locationServiceUpdateFactory = (
  token: LocationServiceUpdate['request']['headers']['Authorization'],
  query: {
    id: string;
    entry: Service;
  }
): LocationServiceUpdate => ({
  request: {
    route: apiRoutes.locationServiceUpdate({ id: query.id }),
    method: 'PATCH',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query?.entry,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
