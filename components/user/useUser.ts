import { useContext, useEffect } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import { getCurrentUserInfo, validateUser } from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/dist/client/router';

export type User = {
  id: string;
};

export type Cookie = {
  name: string;
  value: string;
  path: string;
  maxAgeInS?: number;
  domain?: string;
};

const {
  publicRuntimeConfig: { api },
} = getConfig();

export const useUser = (): User => {
  const cookie =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .filter((cookie: string) => cookie.split('=')[0] === 'AUTH_TOKEN')
          .reduce<Pick<Cookie, 'name' | 'value'>>(
            (map, obj) => {
              return { name: obj.split('=')[0], value: obj.split('=')[1] };
            },
            { name: undefined, value: undefined }
          )
      : undefined;

  const value = cookie?.value;
  const { user, setUser, isAuthenticated, authenticateUser } = useContext(UserContext);
  const router = useRouter();

  const { data: valid, error: validationError } = useSWR(
    new URL('auth/validate', api).toString(),
    () => validateUser(value)
  );
  const { data: userData, error: userDataError } = useSWR(
    new URL('auth/info', api).toString(),
    () => getCurrentUserInfo(value)
  );

  useEffect(() => {
    if (valid === true) {
      console.log('setUser');
      setUser(((userData as unknown) as any)?.user as User);
      authenticateUser();
    } else if (valid === false || userDataError || validationError) {
      router.push('/auth/login');
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

  return user;
};
