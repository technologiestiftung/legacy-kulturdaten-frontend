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
import { Cookie, deleteCookie, setCookie } from '../../lib/cookies';
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

  const {
    user,
    setUser,
    logoutUser,
    isAuthenticated,
    authenticateUser,
    userToken,
    setUserToken,
  } = useContext(UserContext);

  const { data, error: validationError } = useSWR(getApiUrlString(ApiRoutes.authValidate), () =>
    userToken ? call<AuthValidate>(authValidateRequest(userToken)) : { valid: undefined }
  );

  const userTokenIsValid = data?.valid;

  const { data: userData, error: userDataError } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    userToken ? call<AuthInfo>(authInfoRequest(userToken)) : undefined
  );

  const invalidateUser = useCallback(() => {
    if (userToken) {
      call<AuthLogout>(authLogoutRequest(userToken)).catch((e) => console.error(e));
    }
    setUserToken(undefined);
    deleteCookie({ name: authTokenCookieName, path: routes.index } as Cookie);
    logoutUser();
  }, [setUserToken, logoutUser, userToken]);

  useEffect(() => {
    if (userTokenIsValid === false && userToken) {
      invalidateUser();
    } else if (userTokenIsValid === true) {
      if (userData?.user) {
        setUser(userData.user);
        authenticateUser();
      }
    } else if (!userToken || userDataError || validationError) {
      if (router.pathname !== routes.login) {
        router.replace(routes.login);
      }
    }
  }, [
    isAuthenticated,
    authenticateUser,
    userData,
    setUser,
    userToken,
    validationError,
    userDataError,
    router,
    userTokenIsValid,
    invalidateUser,
  ]);

  return {
    user,
    isLoggedIn: isAuthenticated,
    login: (cookie: Cookie, redirectRoute: string) => {
      setCookie(cookie);
      setUserToken(cookie.value);
      authenticateUser();
      router.replace(redirectRoute);
    },
    logout: async () => {
      invalidateUser();
      router.push(routes.index);
    },
  };
};
