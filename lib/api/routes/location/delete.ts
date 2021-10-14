import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Location } from '../../types/location';

/**
 * /auth/info
 */

export interface LocationDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: Location | null;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'Location deleted successfully';
      };
    };
  };
}

export const locationDeleteFactory = (
  token: LocationDelete['request']['headers']['Authorization'],
  query: { id: string; entry: Location }
): LocationDelete => ({
  request: {
    route: apiRoutes.locationDelete({ id: query.id }),
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
