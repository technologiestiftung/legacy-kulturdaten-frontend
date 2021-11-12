import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { routes } from '../../config/routes';
import { useLocale } from '../../lib/routing';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useUser } from '../user/useUser';

type AdminContext = {
  adminModeActive: boolean;
  setAdminModeActive: (adminModeActive: boolean) => void;
  activeOrganizerId: string;
  setActiveOrganizerId: (activeOrganizerId: string) => void;
};

export const AdminContext = React.createContext<AdminContext>({
  adminModeActive: true,
  setAdminModeActive: () => undefined,
  activeOrganizerId: undefined,
  setActiveOrganizerId: () => undefined,
});

interface LoadingContextProviderProps {
  children: ReactNode;
}

export const AdminContextProvider: React.FC<LoadingContextProviderProps> = ({
  children,
}: LoadingContextProviderProps) => {
  const [adminModeActive, setAdminModeActive] = useState<boolean>(false);
  const [activeOrganizerId, setActiveOrganizerId] = useState<string>();
  const { user, isSuperuser, isLoggedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    const { query } = router;

    console.log(query);
  }, [router]);

  useEffect(() => {
    if ((user?.id && !isSuperuser) || !isLoggedIn) {
      setAdminModeActive(false);
      setActiveOrganizerId(undefined);
    }
  }, [user?.id, isSuperuser, isLoggedIn]);

  return (
    <AdminContext.Provider
      value={{
        adminModeActive,
        setAdminModeActive,
        activeOrganizerId,
        setActiveOrganizerId,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminMode = (): {
  adminModeActive: boolean;
  activeOrganizerId: string;
  start: (organizerId: string) => void;
  quit: () => void;
} => {
  const { adminModeActive, activeOrganizerId, setActiveOrganizerId, setAdminModeActive } =
    useContext(AdminContext);
  const router = useRouter();
  const locale = useLocale();
  const loadingScreen = useLoadingScreen();

  const quit = useCallback(() => {
    loadingScreen('Beende Admin Modus', async () => {
      setAdminModeActive(false);
      setActiveOrganizerId(undefined);

      setTimeout(() => router.push(routes.admin({ locale })), 250);

      return { success: true };
    });
  }, [loadingScreen, router, locale, setAdminModeActive, setActiveOrganizerId]);

  const start = useCallback(
    (organizerId: string) => {
      loadingScreen('Starte Admin Modus', async () => {
        setAdminModeActive(true);
        setActiveOrganizerId(organizerId);

        setTimeout(
          () => router.push(routes.dashboard({ locale, query: { organizer: organizerId } })),
          250
        );

        return { success: true };
      });
    },
    [loadingScreen, router, locale, setAdminModeActive, setActiveOrganizerId]
  );

  return {
    adminModeActive,
    activeOrganizerId,
    quit,
    start,
  };
};
