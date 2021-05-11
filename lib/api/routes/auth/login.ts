import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';

/**
 * /auth/login
 */

export interface AuthLogin extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Content-Type': 'application/json';
    };
    body: {
      email: string;
      password: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        type: 'bearer';
        token: string;
        message: string;
      };
    };
  };
}

export const authLoginFactory: ApiCallFactory = (
  token: string,
  query: { body: AuthLogin['request']['body'] }
): AuthLogin => ({
  request: {
    route: apiRoutes.authLogin(),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: query.body,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
