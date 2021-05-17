import { useCallback, useContext, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import {
  AuthValidate,
  authValidateFactory,
  AuthInfo,
  authInfoFactory,
  AuthLogout,
  authLogoutFactory,
  getApiUrlString,
  ApiRoutes,
  useApiCall,
} from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

export interface User {
  authToken: string;
}

export const useUser = (): {
  user: User;
  authToken: string;
  isLoggedIn: boolean;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => void;
} => {
  const {
    authToken,
    setAuthToken,
    user,
    setUser,
    invalidateUser,
    isAuthenticated,
    authenticateUser,
  } = useContext(UserContext);

  const authTokenFromStateOrCookie = useMemo(
    () => authToken || getCookie(authTokenCookieName)?.value,
    [authToken]
  );

  const router = useRouter();
  const locale = useLocale();
  const call = useApiCall(authTokenFromStateOrCookie);

  const { data, mutate: mutateValidate } = useSWR(getApiUrlString(ApiRoutes.authValidate), () =>
    authTokenFromStateOrCookie
      ? call<AuthValidate>(authValidateFactory)
      : { body: { meta: { valid: undefined } } }
  );

  const userTokenIsValid = data?.body?.meta?.valid;

  const { data: userResponse } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    authTokenFromStateOrCookie ? call<AuthInfo>(authInfoFactory) : undefined
  );

  const logoutUser = useCallback(() => {
    if (authTokenFromStateOrCookie) {
      call<AuthLogout>(authLogoutFactory).catch((e) => console.error(e));
    }
    deleteCookie({ name: authTokenCookieName, path: routes.index({ locale }) } as Cookie);
    mutateValidate();
    invalidateUser();
  }, [invalidateUser, mutateValidate, locale, call, authTokenFromStateOrCookie]);

  useEffect(() => {
    const userData = (userResponse?.body.data.attributes as unknown) as User;

    if (authTokenFromStateOrCookie) {
      if (userTokenIsValid === false) {
        logoutUser();
      } else if (userTokenIsValid === true && !isAuthenticated) {
        if (userData) {
          setUser(userData);
          setAuthToken(authTokenFromStateOrCookie);
          authenticateUser();
        }
      }
    } else if (isAuthenticated) {
      logoutUser();
    } else {
      if (locale && router.asPath !== routes.login({ locale })) {
        router.replace(routes.login({ locale }));
      }
    }
  }, [
    isAuthenticated,
    authenticateUser,
    userResponse,
    setUser,
    router,
    userTokenIsValid,
    logoutUser,
    locale,
    authTokenFromStateOrCookie,
    setAuthToken,
    mutateValidate,
  ]);

  return {
    user,
    authToken: authTokenFromStateOrCookie,
    isLoggedIn: isAuthenticated,
    login: (cookie: Cookie, redirectRoute: string) => {
      setCookie(cookie);
      setAuthToken(authTokenFromStateOrCookie);
      router.replace(redirectRoute);
    },
    logout: async () => {
      logoutUser();
      setTimeout(() => {
        router.push(routes.index({ locale }));
      }, 500);
    },
  };
};
