import { apiRoutes, makeBearer, ApiCall } from '../..';

/**
 * /auth/logout
 */

export interface AuthLogout extends ApiCall {
  request: {
    route: typeof apiRoutes.authLogout;
    method: 'POST';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    status: number;
    message: string;
  };
}

export const authLogoutRequest = (
  token: AuthLogout['request']['headers']['Authorization']
): AuthLogout['request'] => ({
  route: apiRoutes.authLogout,
  method: 'POST',
  headers: {
    Authorization: makeBearer(token),
  },
  body: null,
});
