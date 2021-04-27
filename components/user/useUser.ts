import { useCallback, useContext, useEffect } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import {
  call,
  AuthValidate,
  authValidateBlueprint,
  AuthInfo,
  authInfoBlueprint,
  AuthLogout,
  authLogoutBlueprint,
  getApiUrlString,
  ApiRoutes,
} from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { routes, useLocale } from '../../lib/routing';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

export type User = AuthInfo['response']['body']['data']['attributes'];

export const useUser = (): {
  user: User;
  isLoggedIn: boolean;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => void;
} => {
  const router = useRouter();
  const locale = useLocale();

  const { user, setUser, invalidateUser, isAuthenticated, authenticateUser } = useContext(
    UserContext
  );

  const { data, mutate: mutateValidate } = useSWR(getApiUrlString(ApiRoutes.authValidate), () =>
    getCookie(authTokenCookieName)?.value
      ? call<AuthValidate>(authValidateBlueprint(getCookie(authTokenCookieName)?.value))
      : { body: { meta: { valid: undefined } } }
  );

  const userTokenIsValid = data?.body?.meta?.valid;

  const { data: userResponse } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    getCookie(authTokenCookieName)?.value
      ? call<AuthInfo>(authInfoBlueprint(getCookie(authTokenCookieName)?.value))
      : undefined
  );

  const logoutUser = useCallback(() => {
    if (getCookie(authTokenCookieName)?.value) {
      call<AuthLogout>(authLogoutBlueprint(getCookie(authTokenCookieName)?.value)).catch((e) =>
        console.error(e)
      );
    }
    deleteCookie({ name: authTokenCookieName, path: routes.index({ locale }) } as Cookie);
    mutateValidate();
    invalidateUser();
  }, [invalidateUser, mutateValidate, locale]);

  useEffect(() => {
    const userData = userResponse?.body.data.attributes;

    if (getCookie(authTokenCookieName)?.value) {
      if (userTokenIsValid === false) {
        logoutUser();
      } else if (userTokenIsValid === true && !isAuthenticated) {
        if (userData) {
          setUser(userData);
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
  ]);

  return {
    user,
    isLoggedIn: isAuthenticated,
    login: (cookie: Cookie, redirectRoute: string) => {
      setCookie(cookie);
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
