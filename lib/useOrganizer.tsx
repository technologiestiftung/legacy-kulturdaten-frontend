import { useContext, useEffect } from 'react';
import getConfig from 'next/config';
import { NavigationContext } from '../components/navigation/NavigationContext';
import { useCategories } from '../config/categories';
import { OrganizerShow } from './api/routes/organizer/show';
import { Organizer } from './api/types/organizer';
import { useEntry } from './categories';
import { getCookie, setCookie } from './cookies';
import { routes, useLocale } from './routing';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;
const activeOrganizerCookieName =
  (publicRuntimeConfig?.activeOrganizerCookieName as string) || 'ACTIVE_ORGANIZER_ID';

export const useOrganizerId = (): string => {
  const { activeOrganizerId, setActiveOrganizerId } = useContext(NavigationContext);
  const locale = useLocale();

  useEffect(() => {
    const organizerIdFromCookie = getCookie(activeOrganizerCookieName)?.value;

    if (organizerIdFromCookie && activeOrganizerId === 'default') {
      setActiveOrganizerId(organizerIdFromCookie);
    }
  }, [activeOrganizerId, locale, setActiveOrganizerId]);

  return activeOrganizerId;
};

export const useSetOrganizerId = (): ((organizerId: string) => void) => {
  const locale = useLocale();
  const { setActiveOrganizerId } = useContext(NavigationContext);

  return (organizerId): void => {
    setCookie({
      'name': activeOrganizerCookieName,
      'value': organizerId,
      'path': routes.index({ locale }),
      'max-age': 1209600,
    });

    setActiveOrganizerId(organizerId);
  };
};

export const useOrganizer = (): Organizer => {
  const organizerId = useOrganizerId();
  const categories = useCategories();
  const { entry } = useEntry<Organizer, OrganizerShow>(categories?.organizer, {
    organizer: organizerId,
  });

  return entry;
};
