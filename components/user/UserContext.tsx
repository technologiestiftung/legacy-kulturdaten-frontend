import React, { ReactNode, useState } from 'react';

import { User } from './useUser';

type UserContext = {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
  invalidateUser: () => void;
  rand: number;
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
  const [stateUser, setStateUser] = useState<User>();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false);
  const [rand] = useState<number>(Math.random() * 100);

  return (
    <UserContext.Provider
      value={{
        user: stateUser,
        setUser: (initialUser: User) => setStateUser(initialUser),
        isAuthenticated: userIsAuthenticated,
        authenticateUser: () => {
          setUserIsAuthenticated(true);
        },
        invalidateUser: () => {
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
