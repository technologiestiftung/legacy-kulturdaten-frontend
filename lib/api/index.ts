import getConfig from 'next/config';
import { useCallback } from 'react';
import { useUserToken } from '../../components/user/UserContext';
import { apiVersion } from '../../config/api';

const {
  publicRuntimeConfig: { api },
} = getConfig();

type StructuredData =
  | string
  | number
  | boolean
  | Array<StructuredData>
  | { [key: string]: StructuredData };

export interface ApiCall {
  request: {
    route: string;
    method: 'POST' | 'GET' | 'PATCH' | 'DELETE';
    headers?: {
      'Content-Type'?: 'application/json' | 'multipart/form-data';
      'Authorization'?: string;
    };
    body?: { [key: string]: StructuredData };
  };
  response: { status: number; body: { [key: string]: StructuredData } };
}

export type ApiCallBlueprint = (
  token: ApiCall['request']['headers']['Authorization'],
  query?: unknown
) => ApiCall;

/**
 * Define routes
 */

export enum ApiRoutes {
  authRegister = 'authRegister',
  authLogin = 'authLogin',
  authLogout = 'authLogout',
  authValidate = 'authValidate',
  authInfo = 'authInfo',
  organizerList = 'organizerList',
  organizerShow = 'organizerShow',
  organizerCreate = 'organizerCreate',
  organizerUpdate = 'organizerUpdate',
  organizerDelete = 'organizerDelete',
}

export type ApiRoute = (query?: { [key: string]: string }) => string;

export const apiRoutes: {
  [key in ApiRoutes]: ApiRoute;
} = {
  authRegister: () => '/auth/register',
  authLogin: () => '/auth/login',
  authLogout: () => '/auth/logout',
  authValidate: () => '/auth/validate',
  authInfo: () => '/auth/info',
  organizerList: () => `/${apiVersion}/organizer`,
  organizerShow: ({ id }) => `/${apiVersion}/organizer/${id}`,
  organizerCreate: () => `/${apiVersion}/organizer`,
  organizerUpdate: ({ id }) => `/${apiVersion}/organizer/${id}`,
  organizerDelete: ({ id }) => `/${apiVersion}/organizer/${id}`,
};

/**
 * Makes a call to kulturdaten.berlin API
 * @param request
 * @returns
 */
export const call = async <T extends ApiCall>({ request, response }: T): Promise<T['response']> => {
  try {
    const resp = await fetch(new URL(request.route, api).toString(), {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.body, null, 2),
    }).catch((e: ErrorEvent) => {
      throw e;
    });

    const body: T['response']['body'] = await resp.json();

    // TODO: Optimize when API became generalized
    switch (resp.status) {
      case response.status: {
        return {
          status: response.status,
          body,
        };
      }
      case 422: {
        const regError = new Error(JSON.stringify(body));
        regError.name = 'reg error';
        throw regError;
      }
      default: {
        throw new Error(JSON.stringify(body));
      }
    }
  } catch (e) {
    throw e;
  }
};

export const useCall = (token?: string): typeof call => {
  const authToken = useUserToken();

  const cb = useCallback(
    <T extends ApiCall>(info: T): Promise<T['response']> => {
      const mutatedInfo = {
        response: info.response,
        request: {
          ...info.request,
          headers: {
            Authorization: makeBearer(token || authToken),
          },
        },
      };

      return call<T>(mutatedInfo as T);
    },
    [token, authToken]
  );

  return cb;
};

/**
 * Helpers
 */

export const getApiUrl = (apiRoute: ApiRoutes, query?: { [key: string]: string }): URL =>
  new URL(apiRoutes[apiRoute](query), api);
export const getApiUrlString = (apiRoute: ApiRoutes, query?: { [key: string]: string }): string =>
  getApiUrl(apiRoute, query).toString();
export const makeBearer = (token: string): string => `Bearer ${token}`;

/**
 * Export routes
 */

export type { AuthInfo } from './routes/auth/info';
export { authInfoBlueprint } from './routes/auth/info';
export type { AuthLogin } from './routes/auth/login';
export { authLoginBlueprint } from './routes/auth/login';
export type { AuthLogout } from './routes/auth/logout';
export { authLogoutBlueprint } from './routes/auth/logout';
export type { AuthRegister } from './routes/auth/register';
export { authRegisterBlueprint } from './routes/auth/register';
export type { AuthValidate } from './routes/auth/validate';
export { authValidateBlueprint } from './routes/auth/validate';
export type { OrganizerList } from './routes/organizer/list';
export { organizerListBlueprint } from './routes/organizer/list';
