import getConfig from 'next/config';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { routes } from '../../config/routes';
import { useLocale } from '../../lib/routing';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useUser } from '../user/useUser';
import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { defaultOrganizerId } from '../navigation/NavigationContext';
import { useT } from '../../lib/i18n';
import { EntryListContext } from '../EntryList/EntryListContext';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;
const adminOrganizerCookieName =
  (publicRuntimeConfig?.adminOrganizerCookieName as string) || 'ADMIN_ORGANIZER_ID';

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
  const [activeOrganizerId, setActiveOrganizerIdState] = useState<string>();
  const { user, isSuperuser, isLoggedIn } = useUser();
  const locale = useLocale();

  const router = useRouter();

  const setActiveOrganizerId = useCallback(
    (organizerId: string) => {
      setActiveOrganizerIdState(organizerId);

      if (organizerId) {
        setCookie({
          'name': adminOrganizerCookieName,
          'value': organizerId,
          'path': routes.index({ locale }),
          'max-age': 1209600,
        });
      } else {
        deleteCookie({
          name: adminOrganizerCookieName,
          path: routes.index({ locale }),
        } as Cookie);
      }
    },
    [locale]
  );

  useEffect(() => {
    const cookie = getCookie(adminOrganizerCookieName);

    if (cookie?.value?.length > 0 && !adminModeActive) {
      setAdminModeActive(true);
      setActiveOrganizerIdState(cookie.value);
      router.push(routes.dashboard({ locale, query: { organizer: cookie.value } }));
    }
  }, [router, adminModeActive, locale]);

  useEffect(() => {
    if (isLoggedIn && user?.id && !isSuperuser) {
      setAdminModeActive(false);
      setActiveOrganizerId(undefined);
    }
  }, [user?.id, isSuperuser, isLoggedIn, setActiveOrganizerId]);

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
  const t = useT();
  const router = useRouter();
  const locale = useLocale();
  const loadingScreen = useLoadingScreen();
  const { reset: resetEntryList } = useContext(EntryListContext);

  const quit = useCallback(() => {
      setActiveOrganizerId(undefined);
      setAdminModeActive(false);
      resetEntryList();

      setTimeout(() => router.push(routes.admin({ locale })), 250);

      return { success: true };
  }, [ resetEntryList, router, locale, setAdminModeActive, setActiveOrganizerId]);

  const start = useCallback(
    (organizerId: string) => {
        setAdminModeActive(true);
        setActiveOrganizerId(organizerId);
        resetEntryList();

        setTimeout(
          () =>
            router.push(
              routes.dashboard({ locale, query: { organizer: organizerId || defaultOrganizerId } })
            ),
          250
        );

        return { success: true };
    },
    [ resetEntryList, router, locale, setAdminModeActive, setActiveOrganizerId]
  );

  return {
    adminModeActive,
    activeOrganizerId,
    quit,
    start,
  };
};
