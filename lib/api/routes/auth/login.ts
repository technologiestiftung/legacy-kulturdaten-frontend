import { apiRoutes, ApiCall, ApiRoute, ApiCallBlueprint } from '../..';

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

export const authLoginBlueprint: ApiCallBlueprint = (
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
