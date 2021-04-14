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
    user: {
      email: string;
      created_at: string;
      updated_at: string;
      id: number;
    };
    status: number;
    message: string;
  };
}

export const authRegisterRequest = (
  body: AuthRegister['request']['body']
): AuthRegister['request'] => ({
  route: apiRoutes.authRegister,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});
