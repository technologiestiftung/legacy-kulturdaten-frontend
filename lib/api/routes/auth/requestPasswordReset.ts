import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';

/**
 * /auth/login
 */

export interface AuthRequestPasswordReset extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    headers: {
      'Content-Type': 'application/json';
    };
    body: {
      email: string;
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

export const authRequestPasswordResetFactory: ApiCallFactory = (
  token: string,
  query: { body: AuthRequestPasswordReset['request']['body'] }
): AuthRequestPasswordReset => ({
  request: {
    route: apiRoutes.authRequestPasswordReset(),
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
