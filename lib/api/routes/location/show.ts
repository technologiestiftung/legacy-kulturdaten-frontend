import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { Location } from '../../types/location';

/**
 * /auth/info
 */

export interface LocationShow extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      Authorization: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: Location;
    };
  };
}

export const locationShowFactory = (
  token: LocationShow['request']['headers']['Authorization'],
  query: { id: string }
): LocationShow => ({
  request: {
    route: apiRoutes.locationShow({ id: query.id }),
    method: 'GET',
    headers: {
      Authorization: makeBearer(token),
    },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
