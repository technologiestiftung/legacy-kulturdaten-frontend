import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { AppToken } from '../../types/appToken';

/**
 * /appToken
 */

export interface AppTokenCreate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: AppToken;
  };
  response: {
    status: 200;
    body: AppToken;
  };
}

export const appTokenCreateFactory: ApiCallFactory = (
  token: AppTokenCreate['request']['headers']['Authorization'],
  query: { appToken: AppToken }
): AppTokenCreate => ({
  request: {
    route: apiRoutes.appToken(),
    method: 'POST',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query.appToken,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
