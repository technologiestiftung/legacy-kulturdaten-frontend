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
} from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie } from '../../lib/cookies';

export type User = AuthInfo['response']['user'];

const {
  publicRuntimeConfig: { api },
} = getConfig();

export const useUser = (): { user: User; logoutUser: () => void } => {
  const authCookie = getCookie('AUTH_TOKEN');
  const value = authCookie?.value;
  const { user, setUser, logoutUser, isAuthenticated, authenticateUser } = useContext(UserContext);
  const router = useRouter();

  const { data, error: validationError } = useSWR(new URL('auth/validate', api).toString(), () =>
    call<AuthValidate>(authValidateRequest(value))
  );

  const valid = data?.valid;

  const { data: userData, error: userDataError } = useSWR(
    new URL('auth/info', api).toString(),
    () => call<AuthInfo>(authInfoRequest(value))
  );

  useEffect(() => {
    if (valid === true) {
      if (userData?.user) {
        setUser(userData.user);
      }
      authenticateUser();
    } else if (valid === false || userDataError || validationError) {
      if (router.pathname !== '/auth/login') {
        router.replace('/auth/login');
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
      deleteCookie({ name: 'AUTH_TOKEN', path: '/' } as Cookie);
      logoutUser();

      try {
        await call<AuthLogout>(authLogoutRequest(value));
      } catch (e) {
        console.error(e);
      }

      router.push('/');
    },
  };
};
