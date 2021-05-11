import { apiRoutes, ApiCall, ApiRoute } from '../..';

/**
 * /auth/validate
 */

export interface AuthValidate extends ApiCall {
  request: {
    route: ReturnType<ApiRoute>;
    method: 'POST';
    body: null;
  };
  response: {
    status: 200;
    body: { data: null; meta: { valid: boolean } };
  };
}

export const authValidateBlueprint = (): AuthValidate => ({
  request: {
    route: apiRoutes.authValidate(),
    method: 'POST',
    body: null,
  },
  response: {
    status: 200,
    body: undefined,
  },
});
