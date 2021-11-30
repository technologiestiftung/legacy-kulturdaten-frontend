import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';
import { AppToken } from '../../types/appToken';

/**
 * /appToken
 */

export interface AppTokenList extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'GET';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
  };
  response: {
    status: 200;
    body: {
      meta: {
        tokens: AppToken[];
      };
    };
  };
}

export const appTokenListFactory: ApiCallFactory = (
  token: AppTokenList['request']['headers']['Authorization']
): AppTokenList => ({
  request: {
    route: apiRoutes.appToken(),
    method: 'GET',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
  },
  response: {
    status: 200,
    body: undefined,
  },
});
