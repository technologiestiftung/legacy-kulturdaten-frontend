import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallFactory } from '../..';

/**
 * /auth/info
 */

export interface AuthInfo extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      Authorization: string;
    };
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

export const authInfoFactory: ApiCallFactory = (
  token: AuthInfo['request']['headers']['Authorization']
): AuthInfo => ({
  request: {
    route: apiRoutes.authInfo(),
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
