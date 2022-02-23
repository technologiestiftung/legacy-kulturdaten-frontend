import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';

/**
 * /auth/login
 */

export interface AuthResetPassword extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Content-Type': 'application/json';
    };
    body: {
      email: string;
      password: string;
      passwordConfirmation: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: null;
      meta: {
        token: { type: 'bearer'; token: string };
        message: string;
        language: string;
      };
    };
  };
}

export const authResetPasswordFactory: ApiCallFactory = (
  token: string,
  query: { body: AuthResetPassword['request']['body']; signature: string }
): AuthResetPassword => ({
  request: {
    route: apiRoutes.authResetPassword({ email: query.body.email, signature: query.signature }),
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
