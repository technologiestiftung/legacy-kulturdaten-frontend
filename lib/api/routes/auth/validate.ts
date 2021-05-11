import { apiRoutes, makeBearer, ApiCall, ApiRoute, ApiCallBlueprint } from '../..';

/**
 * /auth/validate
 */

export interface AuthValidate extends ApiCall {
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
    body: { data: null; meta: { valid: boolean } };
  };
}

export const authValidateBlueprint: ApiCallBlueprint = (
  token: AuthValidate['request']['headers']['Authorization']
): AuthValidate => ({
  request: {
    route: apiRoutes.authValidate(),
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
