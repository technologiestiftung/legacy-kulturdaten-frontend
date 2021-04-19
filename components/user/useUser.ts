import { useCallback, useContext, useEffect } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import {
  call,
  AuthValidate,
  authValidateRequest,
  AuthInfo,
  authInfoRequest,
  AuthLogout,
  authLogoutRequest,
  getApiUrlString,
  ApiRoutes,
} from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { routes } from '../../lib/routes';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

export type User = AuthInfo['response']['user'];

export const useUser = (): {
  user: User;
  isLoggedIn: boolean;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => void;
} => {
  const router = useRouter();

  const { user, setUser, invalidateUser, isAuthenticated, authenticateUser } = useContext(
    UserContext
  );

  const { data, mutate: mutateValidate } = useSWR(getApiUrlString(ApiRoutes.authValidate), () =>
    getCookie(authTokenCookieName)?.value
      ? call<AuthValidate>(authValidateRequest(getCookie(authTokenCookieName)?.value))
      : { valid: undefined }
  );

  const userTokenIsValid = data?.valid;

  const { data: userData } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    getCookie(authTokenCookieName)?.value
      ? call<AuthInfo>(authInfoRequest(getCookie(authTokenCookieName)?.value))
      : undefined
  );

  const logoutUser = useCallback(() => {
    if (getCookie(authTokenCookieName)?.value) {
      call<AuthLogout>(authLogoutRequest(getCookie(authTokenCookieName)?.value)).catch((e) =>
        console.error(e)
      );
    }
    deleteCookie({ name: authTokenCookieName, path: routes.index() } as Cookie);
    mutateValidate();
    invalidateUser();
  }, [invalidateUser, mutateValidate]);

  useEffect(() => {
    if (getCookie(authTokenCookieName)?.value) {
      if (userTokenIsValid === false) {
        logoutUser();
      } else if (userTokenIsValid === true && !isAuthenticated) {
        if (userData?.user) {
          setUser(userData.user);
          authenticateUser();
        }
      }
    } else if (isAuthenticated) {
      logoutUser();
    } else {
      if (router.pathname !== routes.login()) {
        router.replace(routes.login());
      }
    }
  }, [isAuthenticated, authenticateUser, userData, setUser, router, userTokenIsValid, logoutUser]);

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
        router.push(routes.index());
      }, 500);
    },
  };
};
