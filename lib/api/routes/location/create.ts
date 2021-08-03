import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { Location, CreateLocation } from '../../types/location';

/**
 * /auth/info
 */

export interface LocationCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: CreateLocation;
  };
  response: {
    status: 200;
    body: Location;
  };
}

export const locationCreateFactory: ApiCallFactory = (
  token: LocationCreate['request']['headers']['Authorization'],
  query: { location: CreateLocation }
): LocationCreate => ({
  request: {
    route: apiRoutes.locationCreate(),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.location,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
