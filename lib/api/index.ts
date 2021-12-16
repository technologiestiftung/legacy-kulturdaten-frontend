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
  response: { status: number; body: { [key: string]: unknown } };
}

export type ApiCallFactory = (
  token: ApiCall['request']['headers']['Authorization'],
  query?: unknown
) => ApiCall;

/**
 * Define routes
 */

export enum ApiRoutes {
  appToken = 'appToken',
  authRegister = 'authRegister',
  authLogin = 'authLogin',
  authLogout = 'authLogout',
  authValidate = 'authValidate',
  authInfo = 'authInfo',
  districtList = 'districtList',
  organizerList = 'organizerList',
  organizerShow = 'organizerShow',
  organizerCreate = 'organizerCreate',
  organizerUpdate = 'organizerUpdate',
  organizerDelete = 'organizerDelete',
  organizerTypeList = 'organizerTypeList',
  organizerDownload = 'organizerDownload',
  organizerListDownload = 'organizerListDownload',
  locationList = 'locationList',
  locationShow = 'locationShow',
  locationCreate = 'locationCreate',
  locationUpdate = 'locationUpdate',
  locationDelete = 'locationDelete',
  locationAccessibilityUpdate = 'locationAccessibilityUpdate',
  locationServiceUpdate = 'locationServiceUpdate',
  locationDownload = 'locationDownload',
  locationListDownload = 'locationListDownload',
  offerAudienceUpdate = 'offerAudienceUpdate',
  offerList = 'offerList',
  offerShow = 'offerShow',
  offerCreate = 'offerCreate',
  offerUpdate = 'offerUpdate',
  offerDateCreate = 'offerDateCreate',
  offerDelete = 'offerDelete',
  offerDateUpdate = 'offerDateUpdate',
  offerDateList = 'offerDateList',
  offerTypeList = 'offerTypeList',
  offerMainTypeList = 'offerMainTypeList',
  offerDownload = 'offerDownload',
  offerListDownload = 'offerListDownload',
  mediaShow = 'mediaShow',
  mediaUpdate = 'mediaUpdate',
  mediaDelete = 'mediaDelete',
  mediaLicenseList = 'mediaLicenseList',
  tagList = 'tagList',
  userUpdate = 'userUpdate',
}

export type ApiRoute = (query?: ParsedUrlQuery) => string;

export const apiRoutes: {
  [key in ApiRoutes]: ApiRoute;
} = {
  appToken: () => '/appToken',
  authRegister: () => '/auth/register',
  authLogin: () => '/auth/login',
  authLogout: () => '/auth/logout',
  authValidate: () => '/auth/validate',
  authInfo: () => '/auth/info',
  districtList: () => `/${apiVersion}/district`,
  organizerList: (query) =>
    `/${apiVersion}/organizer?include=types,subjects,translations,logo${
      query?.page ? `&page=${query.page}` : ''
    }${query?.size ? `&size=${query.size}` : ''}${query?.filter ? `&filter=${query.filter}` : ''}${
      query?.sort ? `&sort=${query.sort}` : ''
    }`,
  organizerShow: ({ organizer }) =>
    `/${apiVersion}/organizer/${organizer}?include=types,address,subjects,links,translations,media,tags,logo,contacts,roles`,
  organizerCreate: () => `/${apiVersion}/organizer`,
  organizerUpdate: ({ organizer }) =>
    `/${apiVersion}/organizer/${organizer}?include=types,address,subjects,links,translations,media,tags,logo,contacts,roles`,
  organizerDelete: ({ organizer }) => `/${apiVersion}/organizer/${organizer}`,
  organizerTypeList: () => `/${apiVersion}/organizerType?include=translations`,
  organizerDownload: ({ id, format }) =>
    `/${apiVersion}/organizer/${id}?include=types,address,subjects,links,translations,tags,contacts&format=${format}`,
  organizerListDownload: ({ format }) =>
    `/${apiVersion}/organizer?include=types,address,subjects,links,translations,tags,contacts&sort=-updatedAt&format=${format}`,
  locationList: (query) =>
    `/${apiVersion}/location?include=translations,address${
      query?.page ? `&page=${query.page}` : ''
    }${query?.size ? `&size=${query.size}` : ''}${query?.filter ? `&filter=${query.filter}` : ''}${
      query?.sort ? `&sort=${query.sort}` : ''
    }`,
  locationShow: ({ id }) =>
    `/${apiVersion}/location/${id}?include=links,translations,media,openingHours,organizers,address,accessibility,service,roles`,
  locationCreate: () => `/${apiVersion}/location`,
  locationUpdate: ({ id }) =>
    `/${apiVersion}/location/${id}?include=links,translations,media,openingHours,organizers,address,accessibility,service,roles`,
  locationAccessibilityUpdate: ({ id }) => `/${apiVersion}/location/${id}/accessibility`,
  locationServiceUpdate: ({ id }) => `/${apiVersion}/location/${id}/service`,
  locationDelete: ({ id }) => `/${apiVersion}/location/${id}`,
  locationDownload: ({ id, format }) =>
    `/${apiVersion}/location/${id}?include=links,translations,openingHours,organizers,address,accessibility,service&format=${format}`,
  locationListDownload: ({ format, organizer }) =>
    `/${apiVersion}/location?include=links,translations,openingHours,organizers,address,accessibility,service&filter=organizer=${organizer}&sort=-updatedAt&format=${format}`,
  offerAudienceUpdate: ({ id }) => `/${apiVersion}/offer/${id}/audience`,
  offerList: (query) =>
    `/${apiVersion}/offer?include=translations,types,mainType${
      query?.page ? `&page=${query.page}` : ''
    }${query?.size ? `&size=${query.size}` : ''}${query?.filter ? `&filter=${query.filter}` : ''}${
      query?.sort ? `&sort=${query.sort}` : ''
    }`,
  offerShow: ({ id }) =>
    `/${apiVersion}/offer/${id}?include=translations,media,tags,location,organizers,links,types,subjects,tags,mainType,peakHours,audience`,
  offerCreate: () => `/${apiVersion}/offer`,
  offerUpdate: ({ id }) =>
    `/${apiVersion}/offer/${id}?include=translations,media,tags,location,organizers,links,types,subjects,tags,mainType,peakHours,audience`,
  offerDelete: ({ id }) => `/${apiVersion}/offer/${id}`,
  offerDateCreate: ({ offerId }) => `/${apiVersion}/offer/${offerId}/date/`,
  offerDateUpdate: ({ offerId, dateId }) =>
    `/${apiVersion}/offer/${offerId}/date/${dateId}?include=translations,dates,media`,
  offerDateList: (query) =>
    `/${apiVersion}/offer/${query.offerId}/date?include=translations,dates,media${
      query?.page ? `&page=${query.page}` : ''
    }${query?.size ? `&size=${query.size}` : ''}${query?.filter ? `&filter=${query.filter}` : ''}${
      query?.sort ? `&sort=${query.sort}` : ''
    }`,
  offerDownload: ({ id, format }) =>
    `/${apiVersion}/offer/${id}?include=translations,location,organizers,links,types,subjects,tags,mainType&format=${format}`,
  offerListDownload: ({ format, organizer }) =>
    `/${apiVersion}/offer?include=translations,location,organizers,links,types,subjects,tags,mainType&filter=organizers=${organizer}&sort=-updatedAt&format=${format}`,
  offerTypeList: () => `/${apiVersion}/offerType?include=translations`,
  offerMainTypeList: () => `/${apiVersion}/offerMainType?include=translations`,
  mediaShow: ({ id }) => `/${apiVersion}/media/${id}?include=license`,
  mediaUpdate: ({ id }) => `/${apiVersion}/media/${id}?include=license`,
  mediaDelete: ({ id }) => `/${apiVersion}/media/${id}`,
  mediaLicenseList: () => `/${apiVersion}/mediaLicense`,
  tagList: () => `/${apiVersion}/tag?include=translations`,
  userUpdate: () => `/user`,
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
        } as T['response'];
      }
      case 404: {
        const error404 = new Error(JSON.stringify(body));
        error404.name = 'not found error';
        throw error404;
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
    query?: unknown,
    fileAttribute?: string
  ) => Promise<T['response']>;
} => {
  const authToken = useAuthToken();
  const [progress, setProgress] = useState<number>(0);

  const cb = useCallback(
    <T extends ApiCall>(
      files: FileList,
      factory: ApiCallFactory,
      query?: unknown,
      fileAttribute = 'media[]'
    ) => {
      const { request } = factory(overrideAuthToken || authToken, query);
      const route = request.route;
      const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

      const formData = new FormData();
      if (files) {
        [...files].forEach((file: File) => formData.append(fileAttribute, file));
      }

      const re = new Promise<T['response']>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.upload.addEventListener('progress', (e) => {
          setProgress(e.loaded / e.total);
        });

        req.addEventListener('load', () => {
          resolve({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        req.addEventListener('error', () => {
          reject({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        req.addEventListener('abort', () => {
          reject({
            status: req.status,
            body: req.responseText ? JSON.parse(req.responseText) : undefined,
          } as T['response']);
        });

        setProgress(0);

        req.open('PATCH', new URL(route, api).toString());
        req.setRequestHeader('Authorization', request?.headers?.Authorization);
        req.send(formData);
      });

      return re;
    },
    [authToken, overrideAuthToken]
  );

  return { progress, upload: cb };
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
