import { useContext, useEffect, useState } from 'react';
import getConfig from 'next/config';
import { defaultOrganizerId, NavigationContext } from '../components/navigation/NavigationContext';
import { useCategories } from '../config/categories';
import { OrganizerShow } from './api/routes/organizer/show';
import { Organizer } from './api/types/organizer';
import { useEntry } from './categories';
import { Cookie, deleteCookie, getCookie, setCookie } from './cookies';
import { routes, useLocale } from './routing';
import { useAdminMode } from '../components/Admin/AdminContext';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;
const activeOrganizerCookieName =
  (publicRuntimeConfig?.activeOrganizerCookieName as string) || 'ACTIVE_ORGANIZER_ID';

export const useOrganizerId = (): string => {
  const { activeOrganizerId } = useContext(NavigationContext);
  const setOrganizerId = useSetOrganizerId();
  const locale = useLocale();
  const { adminModeActive, activeOrganizerId: adminActiveOrganizerId } = useAdminMode();
  const router = useRouter();

  useEffect(() => {
    const organizerIdFromCookie = getCookie(activeOrganizerCookieName)?.value;
    const organizerIdFromRoute = router?.query?.organizer as string;

    if (activeOrganizerId === defaultOrganizerId) {
      if (organizerIdFromRoute) {
        setOrganizerId(organizerIdFromRoute);
      } else if (organizerIdFromCookie) {
        setOrganizerId(organizerIdFromCookie);
      }
    }
  }, [activeOrganizerId, locale, setOrganizerId, router?.query?.organizer]);

  return adminModeActive ? adminActiveOrganizerId : activeOrganizerId;
};

export const useSetOrganizerId = (): ((organizerId: string) => void) => {
  const { setActiveOrganizerId } = useContext(NavigationContext);

  return (organizerId): void => {
    if (organizerId === undefined || organizerId === defaultOrganizerId) {
      deleteCookie({
        name: activeOrganizerCookieName,
        path: '/',
      } as Cookie);

      setActiveOrganizerId(defaultOrganizerId);
    } else {
      setCookie({
        'name': activeOrganizerCookieName,
        'value': organizerId,
        'path': '/',
        'max-age': 1209600,
      });

      setActiveOrganizerId(organizerId);
    }
  };
};

export const useOrganizer = (): Organizer & { error?: Error } => {
  const organizerId = useOrganizerId();
  const categories = useCategories();
  const { isLoggedIn } = useUser();
  const [hasError, setHasError] = useState(false);
  const [result, setResult] = useState<Organizer>();

  const { entry } = useEntry<Organizer, OrganizerShow>(
    isLoggedIn ? categories?.organizer : undefined,
    isLoggedIn
      ? {
          organizer: organizerId,
        }
      : undefined,
    !hasError
  );

  useEffect(() => {
    if ((entry as unknown as { error: Error })?.error) {
      setHasError(true);
      setResult({ error: 'no organizer defined' } as unknown as Organizer);
    } else {
      setResult(entry as Organizer);
    }
  }, [entry]);

  return result;
};

export const useHandleActiveOrganizer = () => {
  const { user, isLoggedIn } = useUser();
  const activeOrganizerId = useOrganizerId();
  const setActiveOrganizerId = useSetOrganizerId();
  const router = useRouter();
  const locale = useLocale();
  const { adminModeActive } = useAdminMode();

  useEffect(() => {
    const userOrganizerIds = user?.relations?.organizers?.map(
      (role) => role.relations?.organizer?.id
    );

    const organizerIdFromRouter = router?.query?.organizer as string;

    if (isLoggedIn && !adminModeActive) {
      // Redirect users trying to access foreign organizers
      if (
        Boolean(
          activeOrganizerId &&
            userOrganizerIds?.length > 0 &&
            !userOrganizerIds.includes(activeOrganizerId)
        ) ||
        Boolean(
          organizerIdFromRouter &&
            organizerIdFromRouter !== 'undefined' &&
            organizerIdFromRouter !== defaultOrganizerId &&
            organizerIdFromRouter?.length > 0 &&
            !userOrganizerIds.includes(organizerIdFromRouter)
        )
      ) {
        setActiveOrganizerId(userOrganizerIds[0]);
        console.log('redirect user because no access on organizer, but existing organizer');
        router.replace(routes.dashboard({ locale, query: { organizer: userOrganizerIds[0] } }));
      } else if (userOrganizerIds?.length === 0 && activeOrganizerId !== defaultOrganizerId) {
        console.log('redirect user because no access on organizer, no existing organizer');
        setActiveOrganizerId(defaultOrganizerId);
        router.replace(routes.dashboard({ locale, query: { organizer: defaultOrganizerId } }));
      }
    }
  }, [
    adminModeActive,
    activeOrganizerId,
    isLoggedIn,
    setActiveOrganizerId,
    user?.relations?.organizers,
    router,
    locale,
  ]);
};
