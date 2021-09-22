import getConfig from 'next/config';
import { ParsedUrlQuery } from 'node:querystring';
import { useCallback, useState } from 'react';
import { useAuthToken } from '../../components/user/UserContext';
import { apiVersion } from '../../config/api';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;

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
    body?: { [key: string]: StructuredData | FormData | { [key: string]: FormData } } | FormData;
  };
  response: { status: number; body: { [key: string]: StructuredData & { id?: string } } };
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
  organizerTranslationCreate = 'organizerTranslationCreate',
  organizerDelete = 'organizerDelete',
  organizerTypeList = 'organizerTypeList',
  locationList = 'locationList',
  locationShow = 'locationShow',
  locationCreate = 'locationCreate',
  locationUpdate = 'locationUpdate',
  locationTranslationCreate = 'locationTranslationCreate',
  locationDelete = 'locationDelete',
  offerList = 'offerList',
  offerShow = 'offerShow',
  offerCreate = 'offerCreate',
  offerUpdate = 'offerUpdate',
  offerTranslationCreate = 'offerTranslationCreate',
  offerDelete = 'offerDelete',
  mediaShow = 'mediaShow',
  mediaUpdate = 'mediaUpdate',
  mediaDelete = 'mediaDelete',
  mediaTranslationCreate = 'mediaTranslationCreate',
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
  organizerList: (query) =>
    `/${apiVersion}/organizer?include=types,subjects,translations${
      query?.page && `&page=${query.page}`
    }${query?.size && `&size=${query.size}`}${query?.filter && `&filter=${query.filter}`}${
      query?.sort && `&sort=${query.sort}`
    }`,
  organizerShow: ({ id }) =>
    `/${apiVersion}/organizer/${id}?include=types,address,subjects,links,translations,media`,
  organizerCreate: () => `/${apiVersion}/organizer`,
  organizerUpdate: ({ id }) =>
    `/${apiVersion}/organizer/${id}?include=types,address,subjects,links`,
  organizerTranslationCreate: ({ id }) => `/${apiVersion}/organizer/${id}/translate`,
  organizerDelete: ({ id }) => `/${apiVersion}/organizer/${id}`,
  organizerTypeList: () => `/${apiVersion}/organizerType?include=translations`,
  locationList: (query) =>
    `/${apiVersion}/location?include=translations${query?.page && `&page=${query.page}`}${
      query?.size && `&size=${query.size}`
    }${query?.filter && `&filter=${query.filter}`}${query?.sort && `&sort=${query.sort}`}`,
  locationShow: ({ id }) => `/${apiVersion}/location/${id}?include=links,translations`,
  locationCreate: () => `/${apiVersion}/location`,
  locationUpdate: ({ id }) => `/${apiVersion}/location/${id}?include=links,translations`,
  locationTranslationCreate: ({ id }) => `/${apiVersion}/location/${id}/translate`,
  locationDelete: ({ id }) => `/${apiVersion}/location/${id}`,
  offerList: (query) =>
    `/${apiVersion}/offer?include=translations${query?.page && `&page=${query.page}`}${
      query?.size && `&size=${query.size}`
    }${query?.filter && `&filter=${query.filter}`}${query?.sort && `&sort=${query.sort}`}`,
  offerShow: ({ id }) => `/${apiVersion}/offer/${id}?include=translations`,
  offerCreate: () => `/${apiVersion}/offer`,
  offerUpdate: ({ id }) => `/${apiVersion}/offer/${id}?include=translations`,
  offerTranslationCreate: ({ id }) => `/${apiVersion}/offer/${id}/translate`,
  offerDelete: ({ id }) => `/${apiVersion}/offer/${id}`,
  mediaShow: ({ id }) => `/${apiVersion}/media/${id}`,
  mediaUpdate: ({ id }) => `/${apiVersion}/media/${id}`,
  mediaDelete: ({ id }) => `/${apiVersion}/media/${id}`,
  mediaTranslationCreate: ({ id }) => `/${apiVersion}/media/${id}/translate`,
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

  const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

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

export const useMediaUpload = (
  overrideAuthToken?: string
): {
  progress: number;
  upload: <T extends ApiCall>(
    files: FileList | File[],
    factory: ApiCallFactory,
    query?: unknown
  ) => Promise<T['response']>;
} => {
  const authToken = useAuthToken();
  const [progress, setProgress] = useState<number>(0);

  const cb = useCallback(
    <T extends ApiCall>(files: FileList, factory: ApiCallFactory, query?: unknown) => {
      const { request, response } = factory(overrideAuthToken || authToken, query);
      const route = request.route;
      const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

      const formData = new FormData();
      if (files) {
        [...files].forEach((file: File) => formData.append('media[]', file));
      }

      const re = new Promise<T['response']>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.upload.addEventListener('progress', (e) => {
          setProgress(e.loaded / e.total);
        });

        req.addEventListener('load', (e) => {
          resolve({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        req.addEventListener('error', (e) => {
          console.error('error');
          console.log(e);
          reject({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        req.addEventListener('abort', (e) => {
          console.log('aborted');
          console.log(e);
          reject({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        setProgress(0);
        req.open('PATCH', new URL(route, api).toString());
        req.send(formData);
      });
      // req.open('PATCH', );

      return re;
    },
    [authToken, overrideAuthToken]
  );

  return { progress, upload: cb };
};

/**
 * Makes a call to kulturdaten.berlin API
 * @param request
 * @returns
 */
export const upload = async <T extends ApiCall>(
  { request, response }: T,
  files: FileList
): Promise<T['response']> => {
  const route = request.route;

  const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

  const formData = new FormData();

  [...files].forEach(<T extends ApiCall>(file: File) => formData.append('media', file));

  const req = new XMLHttpRequest();

  req.upload.addEventListener('progress', () => undefined);

  req.upload.addEventListener('load', () => undefined);

  req.upload.addEventListener('error', () => undefined);

  req.upload.addEventListener('abort', () => undefined);

  req.open('PATCH', route);
  req.send(formData);

  try {
    const resp = await fetch(new URL(route, api).toString(), {
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

/**
 * Helpers
 */

export const getApiUrl = (
  apiRoute: ApiRoutes,
  query?: ParsedUrlQuery,
  includes?: string[]
): URL => {
  const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

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
export type { LocationList } from './routes/location/list';
export { locationListFactory } from './routes/location/list';
export type { OfferList } from './routes/offer/list';
export { offerListFactory } from './routes/offer/list';
