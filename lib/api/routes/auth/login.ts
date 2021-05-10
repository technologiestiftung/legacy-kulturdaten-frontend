import { apiRoutes, ApiCall, ApiRoute } from '../..';

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

export const authLoginBlueprint = (body: AuthLogin['request']['body']): AuthLogin => ({
  request: {
    route: apiRoutes.authLogin(),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
