import { apiRoutes, makeBearer, ApiCall, ApiRoute } from '../..';
import { AppToken } from '../../types/appToken';

/**
 * /auth/info
 */

export interface AppTokenDelete extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'DELETE';
    headers: {
      'Authorization': string;
      'Content-Type': 'application/json';
    };
    body: AppToken;
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        message: 'AppToken deleted successfully';
      };
    };
  };
}

export const appTokenDeleteFactory = (
  token: AppTokenDelete['request']['headers']['Authorization'],
  query: { id: string; appToken: AppToken }
): AppTokenDelete => ({
  request: {
    route: apiRoutes.appToken({ id: query.id }),
    method: 'DELETE',
    headers: {
      'Authorization': makeBearer(token),
      'Content-Type': 'application/json',
    },
    body: query?.appToken,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
