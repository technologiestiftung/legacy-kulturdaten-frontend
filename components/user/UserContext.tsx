import React, { ReactNode, useContext, useEffect, useState } from 'react';
import getConfig from 'next/config';

import { getCookie } from '../../lib/cookies';
import { User } from './useUser';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

type UserContext = {
  authToken: string;
  setAuthToken: (authToken: string) => void;
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
  invalidateUser: () => void;
  rand: number;
};

export const UserContext = React.createContext<UserContext>({
  authToken: undefined,
  setAuthToken: () => {
    //
  },
  user: null,
  setUser: () => {
    //
  },
  isAuthenticated: false,
  authenticateUser: () => {
    //
  },
  invalidateUser: () => {
    //
  },
  rand: Math.random() * 100,
});

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}: UserContextProviderProps) => {
  const [authToken, setAuthToken] = useState<string>();
  const [stateUser, setStateUser] = useState<User>();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false);
  const [rand] = useState<number>(Math.random() * 100);

  useEffect(() => {
    setAuthToken(getCookie(authTokenCookieName)?.value);
  }, [setAuthToken]);

  return (
    <UserContext.Provider
      value={{
        authToken,
        setAuthToken,
        user: stateUser,
        setUser: (initialUser: User) => setStateUser(initialUser),
        isAuthenticated: userIsAuthenticated,
        authenticateUser: () => {
          setUserIsAuthenticated(true);
        },
        invalidateUser: () => {
          setAuthToken(undefined);
          setStateUser(undefined);
          setUserIsAuthenticated(false);
        },
        rand,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserToken = (): string => {
  const { authToken } = useContext(UserContext);

  return authToken;
};
