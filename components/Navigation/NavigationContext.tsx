import React, { ReactNode, useState } from 'react';

type NavigationContext = {
  mainMenuOpen: boolean;
  setMainMenuOpen: (open: boolean) => void;
  activeSubMenu: number;
  setActiveSubMenu: (subMenuKey: number) => void;
};

export const NavigationContext = React.createContext<NavigationContext>({
  mainMenuOpen: false,
  setMainMenuOpen: () => {
    //
  },
  activeSubMenu: undefined,
  setActiveSubMenu: () => {
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
  const [activeSubMenuState, setActiveSubMenuState] = useState<number>();

  return (
    <NavigationContext.Provider
      value={{
        mainMenuOpen: mainMenuOpenState,
        setMainMenuOpen: (open) => {
          setMainMenuOpenState(open);
        },
        activeSubMenu: activeSubMenuState,
        setActiveSubMenu: (subMenuKey) => setActiveSubMenuState(subMenuKey),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
