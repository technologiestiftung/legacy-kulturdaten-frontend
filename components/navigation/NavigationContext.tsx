import React, { ReactNode, useState } from 'react';

type NavigationContext = {
  mainMenuOpen: boolean;
  setMainMenuOpen: (open: boolean) => void;
};

export const NavigationContext = React.createContext<NavigationContext>({
  mainMenuOpen: false,
  setMainMenuOpen: () => {
    //
  },
});

interface NavigationContextProviderProps {
  children: ReactNode;
}

export const NavigationContextProvider: React.FC<NavigationContextProviderProps> = ({
  children,
}: NavigationContextProviderProps) => {
  const [mainMenuOpenState, setMainMenuOpenState] = useState<boolean>(false);

  return (
    <NavigationContext.Provider
      value={{
        mainMenuOpen: mainMenuOpenState,
        setMainMenuOpen: (open) => {
          setMainMenuOpenState(open);
        },
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
