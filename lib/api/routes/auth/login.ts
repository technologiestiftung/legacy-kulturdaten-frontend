import { apiRoutes, ApiCall } from '../..';

/**
 * /auth/login
 */

export interface AuthLogin extends ApiCall {
  request: {
    route: typeof apiRoutes.authLogin;
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
    token: {
      type: 'bearer';
      token: string;
    };
    status: number;
    message: string;
  };
}

export const authLoginRequest = (body: AuthLogin['request']['body']): AuthLogin['request'] => ({
  route: apiRoutes.authLogin,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});
