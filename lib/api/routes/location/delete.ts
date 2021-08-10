import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';

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
    body: null;
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
  query: { id: string }
): LocationDelete => ({
  request: {
    route: apiRoutes.locationDelete({ id: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
