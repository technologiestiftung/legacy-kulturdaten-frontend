import { ParsedUrlQuery } from 'node:querystring';
import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Location } from '../../types/location';

/**
 * /auth/info
 */

export interface LocationList extends ApiCall {
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
      data: Location[];
    };
  };
}

export const locationListFactory: ApiCallFactory = (
  token: LocationList['request']['headers']['Authorization'],
  query: ParsedUrlQuery
): LocationList => ({
  request: {
    route: apiRoutes.locationList(query),
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
