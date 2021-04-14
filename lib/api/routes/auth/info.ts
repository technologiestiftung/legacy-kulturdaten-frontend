import { apiRoutes, makeBearer, ApiCall } from '../..';

/**
 * /auth/info
 */

export interface AuthInfo extends ApiCall {
  request: {
    route: typeof apiRoutes.authInfo;
    method: 'POST';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    user: {
      id: number;
      email: string;
      remember_me_token?: null;
      created_at: string;
      updated_at: string;
    };
    status: number;
  };
}

export const authInfoRequest = (
  token: AuthInfo['request']['headers']['Authorization']
): AuthInfo['request'] => ({
  route: apiRoutes.authInfo,
  method: 'POST',
  headers: {
    Authorization: makeBearer(token),
  },
  body: null,
});
