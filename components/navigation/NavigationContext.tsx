import React, { ReactNode, Reducer, useCallback, useMemo, useReducer, useState } from 'react';
import { getPseudoUID } from '../../lib/uid';

type NavigationContext = {
  mainMenuOpen: boolean;
  setMainMenuOpen: (open: boolean) => void;
  registerOverlay: (open?: boolean) => { id: string };
  removeOverlay: (id: string) => void;
  setOverlayOpen: (id: string, open: boolean) => void;
  overlayOpen: boolean;
  activeMenuKey: string;
  setActiveMenuKey: (menuKey: string) => void;
};

export const NavigationContext = React.createContext<NavigationContext>({
  mainMenuOpen: false,
  setMainMenuOpen: () => undefined,
  registerOverlay: () => undefined,
  removeOverlay: () => undefined,
  setOverlayOpen: () => undefined,
  overlayOpen: false,
  activeMenuKey: 'main',
  setActiveMenuKey: () => undefined,
});

enum OverlayActions {
  register = 'register',
  open = 'open',
  close = 'close',
  remove = 'remove',
}

type OverlaysState = { [key: string]: boolean };

type OverlayAction = {
  type: OverlayActions;
  payload?: {
    id?: string;
    open?: boolean;
  };
};

const linksReducer: Reducer<OverlaysState, OverlayAction> = (state, action) => {
  switch (action.type) {
    case OverlayActions.register: {
      return { ...state, [action.payload.id]: action.payload.open || false };
    }

    case OverlayActions.open: {
      return { ...state, [action.payload.id]: true };
    }

    case OverlayActions.close: {
      return { ...state, [action.payload.id]: false };
    }

    case OverlayActions.remove: {
      const cleanedState = { ...state };
      delete cleanedState[action.payload.id];

      return cleanedState;
    }

    default: {
      break;
    }
  }
};

interface NavigationContextProviderProps {
  children: ReactNode;
}

export const NavigationContextProvider: React.FC<NavigationContextProviderProps> = ({
  children,
}: NavigationContextProviderProps) => {
  const [mainMenuOpenState, setMainMenuOpenState] = useState<boolean>(false);
  const [activeMenuKey, setActiveMenuKeyS] = useState<string>();

  const [overlays, dispatchOverlayAction] = useReducer(linksReducer, {});

  const setOverlayOpen = useCallback((id: string, open: boolean) => {
    if (open) {
      dispatchOverlayAction({ type: OverlayActions.open, payload: { id } });
    } else {
      dispatchOverlayAction({ type: OverlayActions.close, payload: { id } });
    }
  }, []);

  const registerOverlay = useCallback((open?: boolean) => {
    const overlayId = getPseudoUID();

    dispatchOverlayAction({
      type: OverlayActions.register,
      payload: { id: overlayId, open },
    });

    return { id: overlayId };
  }, []);

  const removeOverlay = useCallback(
    (id: string) => dispatchOverlayAction({ type: OverlayActions.remove, payload: { id } }),
    []
  );

  const overlayOpen = useMemo(() => Object.values(overlays).includes(true), [overlays]);

  return (
    <NavigationContext.Provider
      value={{
        mainMenuOpen: mainMenuOpenState,
        setMainMenuOpen: (open) => setMainMenuOpenState(open),
        registerOverlay,
        removeOverlay,
        setOverlayOpen,
        overlayOpen,
        activeMenuKey,
        setActiveMenuKey: (menuKey: string) => {
          console.log('ejo', menuKey);
          setActiveMenuKeyS(menuKey);
        },
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
