import { apiRoutes, ApiCall } from '../..';

/**
 * /auth/register
 */

export interface AuthRegister extends ApiCall {
  request: {
    route: typeof apiRoutes.authRegister;
    method: 'POST';
    headers: {
      'Content-Type': 'application/json';
    };
    body: {
      email: string;
      password: string;
      password_confirmation: string;
    };
  };
  response: {
    status: 200;
    body: {
      data: {
        type: 'user';
        attributes: {
          email: string;
          created_at: string;
          updated_at: string;
          id: number;
        };
      };
      meta: {
        message: string;
      };
    };
  };
}

export const authRegisterBlueprint = (body: AuthRegister['request']['body']): AuthRegister => ({
  request: {
    route: apiRoutes.authRegister,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
