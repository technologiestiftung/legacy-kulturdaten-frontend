import { useContext, useEffect } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import { call, AuthValidate, authValidateRequest, AuthInfo, authInfoRequest } from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie } from '../../lib/cookies';

export type User = {
  id: string;
};

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
      console.log('setUser');
      setUser(((userData as unknown) as any)?.user as User);
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
    logoutUser: () => {
      deleteCookie({ name: 'AUTH_TOKEN', path: '/' } as Cookie);
      logoutUser();
      router.push('/');
    },
  };
};
