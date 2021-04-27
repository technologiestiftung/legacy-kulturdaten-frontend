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
    status: 200;
    body: {
      data: null;
      meta: {
        message: string;
      };
    };
  };
}

export const authLogoutBlueprint = (
  token: AuthLogout['request']['headers']['Authorization']
): AuthLogout => ({
  request: {
    route: apiRoutes.authLogout,
    method: 'POST',
    headers: {
      Authorization: makeBearer(token),
    },
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
