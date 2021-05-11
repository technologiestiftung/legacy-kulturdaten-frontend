import { apiRoutes, ApiCall, ApiRoute } from '../..';

/**
 * /auth/info
 */

export interface AuthInfo extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    body: null;
  };
  response: {
    status: 200;
    body: {
      data: {
        type: 'user';
        attributes: {
          id: number;
          email: string;
          rememberMeToken?: null;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
}

export const authInfoBlueprint = (): AuthInfo => ({
  request: {
    route: apiRoutes.authInfo(),
    method: 'POST',
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
