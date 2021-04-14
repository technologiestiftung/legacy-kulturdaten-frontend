import getConfig from 'next/config';

const {
  publicRuntimeConfig: { api },
} = getConfig();

type StructuredData =
  | string
  | number
  | boolean
  | Array<StructuredData>
  | { [key: string]: StructuredData };

interface ApiCall {
  request: {
    route: string;
    method: 'POST' | 'GET' | 'PATCH' | 'DELETE';
    headers: {
      'Content-Type'?: 'application/json' | 'multipart/form-data';
      'Authorization'?: string;
    };
    body: { [key: string]: StructuredData };
  };
  response: { [key: string]: StructuredData };
}

export enum ApiRoutes {
  authRegister = 'authRegister',
  authLogin = 'authLogin',
  authLogout = 'authLogout',
  authValidate = 'authValidate',
  authInfo = 'authInfo',
}

export const apiRoutes: { [key in ApiRoutes]: string } = {
  authRegister: '/auth/register',
  authLogin: '/auth/login',
  authLogout: '/auth/logout',
  authValidate: '/auth/validate',
  authInfo: '/auth/info',
};

export const getApiUrl = (apiRoute: ApiRoutes): URL => new URL(apiRoutes[apiRoute], api);
export const getApiUrlString = (apiRoute: ApiRoutes): string => getApiUrl(apiRoute).toString();

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

/**
 * /auth/login
 */

export interface AuthLogin extends ApiCall {
  request: {
    route: typeof apiRoutes.authLogin;
    method: 'POST';
    headers: {
      'Content-Type': 'application/json';
    };
    body: {
      email: string;
      password: string;
    };
  };
  response: {
    token: {
      type: 'bearer';
      token: string;
    };
    status: number;
    message: string;
  };
}

export const authLoginRequest = (body: AuthLogin['request']['body']): AuthLogin['request'] => ({
  route: apiRoutes.authLogin,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});

/**
 * /auth/logout
 */

export interface AuthLogout extends ApiCall {
  request: {
    route: typeof apiRoutes.authLogout;
    method: 'POST';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    status: number;
    message: string;
  };
}

export const authLogoutRequest = (
  token: AuthLogout['request']['headers']['Authorization']
): AuthLogout['request'] => ({
  route: apiRoutes.authLogout,
  method: 'POST',
  headers: {
    Authorization: makeBearer(token),
  },
  body: null,
});

/**
 * /auth/validate
 */

export interface AuthValidate extends ApiCall {
  request: {
    route: typeof apiRoutes.authValidate;
    method: 'POST';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    valid: boolean;
  };
}

export const authValidateRequest = (
  token: AuthValidate['request']['headers']['Authorization']
): AuthValidate['request'] => ({
  route: apiRoutes.authValidate,
  method: 'POST',
  headers: {
    Authorization: makeBearer(token),
  },
  body: null,
});

/**
 * /auth/info
 */

export interface AuthInfo extends ApiCall {
  request: {
    route: typeof apiRoutes.authInfo;
    method: 'POST';
    headers: {
      Authorization: string;
    };
    body: null;
  };
  response: {
    user: {
      id: number;
      email: string;
      remember_me_token?: null;
      created_at: string;
      updated_at: string;
    };
    status: number;
  };
}

export const authInfoRequest = (
  token: AuthInfo['request']['headers']['Authorization']
): AuthInfo['request'] => ({
  route: apiRoutes.authInfo,
  method: 'POST',
  headers: {
    Authorization: makeBearer(token),
  },
  body: null,
});

/**
 * Makes a call to kulturdaten.berlin API
 * @param request
 * @returns
 */
export const call = async <T extends ApiCall>(request: T['request']): Promise<T['response']> => {
  try {
    const resp = await fetch(new URL(request.route, api).toString(), {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.body, null, 2),
    });

    const data: T['response'] = await resp.json();

    // TODO: Optimize when API became generalized
    switch (resp.status) {
      case 200: {
        return data;
      }
      case 422: {
        const regError = new Error(JSON.stringify(data));
        regError.name = 'reg error';
        throw regError;
      }
      default: {
        throw new Error(JSON.stringify(data));
      }
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Helpers
 */

const makeBearer = (token: string) => `Bearer ${token}`;
