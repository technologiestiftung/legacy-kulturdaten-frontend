import getConfig from 'next/config';
import { ParsedUrlQuery } from 'node:querystring';
import { useCallback } from 'react';
import { useAuthToken } from '../../components/user/UserContext';
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

export type ApiCallFactory = (
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
  OrganizerTranslationCreate = 'OrganizerTranslationCreate',
  organizerDelete = 'organizerDelete',
  organizerTypeList = 'organizerTypeList',
}

export type ApiRoute = (query?: ParsedUrlQuery) => string;

export const apiRoutes: {
  [key in ApiRoutes]: ApiRoute;
} = {
  authRegister: () => '/auth/register',
  authLogin: () => '/auth/login',
  authLogout: () => '/auth/logout',
  authValidate: () => '/auth/validate',
  authInfo: () => '/auth/info',
  organizerList: () => `/${apiVersion}/organizer?include=types`,
  organizerShow: ({ id }) => `/${apiVersion}/organizer/${id}?include=types,address,subjects,links`,
  organizerCreate: () => `/${apiVersion}/organizer`,
  organizerUpdate: ({ id }) =>
    `/${apiVersion}/organizer/${id}?include=types,address,subjects,links`,
  OrganizerTranslationCreate: ({ organizerId }) =>
    `/${apiVersion}/organizer/${organizerId}/translate`,
  organizerDelete: ({ id }) => `/${apiVersion}/organizer/${id}`,
  organizerTypeList: () => `/${apiVersion}/organizerType`,
};

const addUrlParam = (url: string, param: string): string =>
  url.includes('?') ? `${url}&${param}` : `${url}?${param}`;

/**
 * Makes a call to kulturdaten.berlin API
 * @param request
 * @returns
 */
export const call = async <T extends ApiCall>(
  { request, response }: T,
  includes?: string[]
): Promise<T['response']> => {
  const routeWithIncludes = Array.isArray(includes)
    ? addUrlParam(request.route, `include=${includes.join(',')}`)
    : request.route;

  try {
    const resp = await fetch(new URL(routeWithIncludes, api).toString(), {
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

export const useApiCall = (
  overrideAuthToken?: string
): (<T extends ApiCall>(
  factory: ApiCallFactory,
  query?: unknown,
  includes?: string[]
) => Promise<T['response']>) => {
  const authToken = useAuthToken();

  const cb = useCallback(
    <T extends ApiCall>(
      factory: ApiCallFactory,
      query?: unknown,
      includes?: string[]
    ): Promise<T['response']> => {
      return call<T>(factory(overrideAuthToken || authToken, query) as T, includes);
    },
    [overrideAuthToken, authToken]
  );

  return cb;
};

/**
 * Helpers
 */

export const getApiUrl = (
  apiRoute: ApiRoutes,
  query?: ParsedUrlQuery,
  includes?: string[]
): URL => {
  const route = apiRoutes[apiRoute](query);
  const routeWithIncludes = Array.isArray(includes)
    ? addUrlParam(route, `include=${includes.join(',')}`)
    : route;
  return new URL(routeWithIncludes, api);
};
export const getApiUrlString = (
  apiRoute: ApiRoutes,
  query?: ParsedUrlQuery,
  includes?: string[]
): string => getApiUrl(apiRoute, query, includes).toString();
export const makeBearer = (token: string): string => `Bearer ${token}`;

/**
 * Export routes
 */

export type { AuthInfo } from './routes/auth/info';
export { authInfoFactory } from './routes/auth/info';
export type { AuthLogin } from './routes/auth/login';
export { authLoginFactory } from './routes/auth/login';
export type { AuthLogout } from './routes/auth/logout';
export { authLogoutFactory } from './routes/auth/logout';
export type { AuthRegister } from './routes/auth/register';
export { authRegisterFactory } from './routes/auth/register';
export type { AuthValidate } from './routes/auth/validate';
export { authValidateFactory } from './routes/auth/validate';
export type { OrganizerList } from './routes/organizer/list';
export { organizerListFactory } from './routes/organizer/list';
