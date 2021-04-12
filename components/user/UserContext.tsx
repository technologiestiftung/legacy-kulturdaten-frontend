import React, { ReactNode, useState } from 'react';
import { User } from './useUser';

type UserContext = {
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
};

export const UserContext = React.createContext<UserContext>({
  user: {
    id: 'test',
  },
  setUser: () => {
    //
  },
  isAuthenticated: false,
  authenticateUser: () => {
    //
  },
});

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}: UserContextProviderProps) => {
  const [stateUser, setStateUser] = useState<User>({
    id: null,
  });
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
