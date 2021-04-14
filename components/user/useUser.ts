import { useContext, useEffect } from 'react';
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
import { Cookie, deleteCookie, getCookie } from '../../lib/cookies';
import { routes } from '../../lib/routes';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

export type User = AuthInfo['response']['user'];

export const useUser = (): { user: User; logoutUser: () => void } => {
  const authCookie = getCookie(authTokenCookieName);
  const value = authCookie?.value;
  const { user, setUser, logoutUser, isAuthenticated, authenticateUser } = useContext(UserContext);
  const router = useRouter();

  const { data, error: validationError } = useSWR(getApiUrlString(ApiRoutes.authValidate), () =>
    call<AuthValidate>(authValidateRequest(value))
  );

  const valid = data?.valid;

  const { data: userData, error: userDataError } = useSWR(getApiUrlString(ApiRoutes.authInfo), () =>
    call<AuthInfo>(authInfoRequest(value))
  );

  useEffect(() => {
    if (valid === true) {
      if (userData?.user) {
        setUser(userData.user);
      }
      authenticateUser();
    } else if (valid === false || userDataError || validationError) {
      if (router.pathname !== routes.login) {
        router.replace(routes.login);
      }
    }
  }, [
    authenticateUser,
    setUser,
    userData,
    isAuthenticated,
    value,
    validationError,
    userDataError,
    router,
    valid,
  ]);

  return {
    user,
    logoutUser: async () => {
      deleteCookie({ name: authTokenCookieName, path: routes.index } as Cookie);
      logoutUser();

      try {
        await call<AuthLogout>(authLogoutRequest(value));
      } catch (e) {
        console.error(e);
      }

      router.push(routes.index);
    },
  };
};
