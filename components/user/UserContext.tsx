import React, { ReactNode, useState } from 'react';
import { User } from './useUser';

type UserContext = {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
  logoutUser: () => void;
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
});

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}: UserContextProviderProps) => {
  const [stateUser, setStateUser] = useState<User>();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false);

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
          console.log('hey');
          setStateUser(undefined);
          setUserIsAuthenticated(false);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
