import { apiRoutes, ApiCall, ApiRoute } from '../..';

/**
 * /auth/logout
 */

export interface AuthLogout extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
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

export const authLogoutBlueprint = (): AuthLogout => ({
  request: {
    route: apiRoutes.authLogout(),
    method: 'POST',
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
