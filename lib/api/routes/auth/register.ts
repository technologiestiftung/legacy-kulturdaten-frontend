import { apiRoutes, ApiCall, ApiRoute, ApiCallFactory } from '../..';

/**
 * /auth/register
 */

export interface AuthRegister extends ApiCall {
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
      data: {
        type: 'user';
        attributes: {
          email: string;
          createdAt: string;
          updatedAt: string;
          id: number;
        };
      };
      meta: {
        message: string;
      };
    };
  };
}

export const authRegisterFactory: ApiCallFactory = (
  token: string,
  query: { body: AuthRegister['request']['body'] }
): AuthRegister => ({
  request: {
    route: apiRoutes.authRegister(),
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
