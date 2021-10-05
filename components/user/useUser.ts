import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { routes, useActiveRoute, useLocale } from '../../lib/routing';
import { User } from '../../lib/api/types/user';
import { internalRoutes } from '../../config/routes';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;

export type WrappedUser = {
  user: User;
  authToken: string;
  isLoggedIn: boolean;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => void;
};

export const useUser = (): WrappedUser => {
  const authTokenCookieName = publicRuntimeConfig?.authTokenCookieName || 'AUTH_TOKEN';

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
    [authToken, authTokenCookieName]
  );

  const router = useRouter();
  const locale = useLocale();
  const call = useApiCall(authTokenFromStateOrCookie);
  const activeRoute = useActiveRoute();

  const { data, mutate: mutateValidate } = useSWR(
    [getApiUrlString(ApiRoutes.authValidate), authTokenFromStateOrCookie],
    (url: string, requestAuthToken: string) =>
      requestAuthToken
        ? call<AuthValidate>(authValidateFactory)
        : { body: { meta: { valid: undefined } } }
  );

  const [userTokenIsValid, setUserTokenIsValid] = useState<boolean>();

  useEffect(() => {
    setUserTokenIsValid(data?.body?.meta?.valid);
  }, [data?.body?.meta?.valid]);

  const { data: userResponse } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    authTokenFromStateOrCookie ? call<AuthInfo>(authInfoFactory) : undefined
  );

  const logoutUser = useCallback(() => {
    if (authTokenFromStateOrCookie) {
      call<AuthLogout>(authLogoutFactory).catch((e) => console.error(e));
    }
    deleteCookie({ name: authTokenCookieName, path: routes.index({ locale }) } as Cookie);
    mutateValidate(undefined);
    setUserTokenIsValid(false);
    invalidateUser();
  }, [
    authTokenFromStateOrCookie,
    authTokenCookieName,
    locale,
    mutateValidate,
    invalidateUser,
    call,
  ]);

  useEffect(() => {
    const userData = userResponse?.body.data.attributes as unknown as User;

    if (authTokenFromStateOrCookie) {
      if (userTokenIsValid === false) {
        console.log('userTokenIsValid = false, log out!');
        logoutUser();
      } else if (userTokenIsValid === true && !isAuthenticated) {
        if (userData) {
          setUser(userData);
          setAuthToken(authTokenFromStateOrCookie);
          authenticateUser();
        }
      }
    } else if (isAuthenticated) {
      console.log('no token present, log out!');
      logoutUser();
    } else {
      if (locale && internalRoutes.includes(activeRoute)) {
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
    activeRoute,
  ]);

  return {
    user: user,
    authToken: authTokenFromStateOrCookie,
    isLoggedIn: isAuthenticated,
    login: (cookie: Cookie, redirectRoute: string) => {
      setAuthToken(cookie.value);
      setCookie(cookie);
      mutateValidate({ body: { meta: { valid: true } } });
      setUserTokenIsValid(true);
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
