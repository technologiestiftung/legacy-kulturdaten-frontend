import React, { ReactNode, useState } from 'react';
import getConfig from 'next/config';

import { getCookie } from '../../lib/cookies';
import { User } from './useUser';

const {
  publicRuntimeConfig: { authTokenCookieName },
} = getConfig();

type UserContext = {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
  logoutUser: () => void;
  userToken: string;
  setUserToken: (token: string) => void;
};

export const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: () => {
    //
  },
  isAuthenticated: false,
  authenticateUser: () => {
    //
  },
  logoutUser: () => {
    //
  },
  userToken: undefined,
  setUserToken: () => {
    //
  },
});

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}: UserContextProviderProps) => {
  const [stateUser, setStateUser] = useState<User>();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false);
  const [stateUserToken, setStateUserToken] = useState<string>(
    getCookie(authTokenCookieName)?.value
  );

  return (
    <UserContext.Provider
      value={{
        user: stateUser,
        setUser: (initialUser: User) => setStateUser(initialUser),
        isAuthenticated: userIsAuthenticated,
        authenticateUser: () => {
          setUserIsAuthenticated(true);
        },
        logoutUser: () => {
          setStateUser(undefined);
          setUserIsAuthenticated(false);
        },
        userToken: stateUserToken,
        setUserToken: (token: string) => setStateUserToken(token),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
