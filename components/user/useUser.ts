import { useContext, useMemo } from 'react';
import getConfig from 'next/config';

import { UserContext } from './UserContext';
import { Cookie, getCookie } from '../../lib/cookies';
import { User } from '../../lib/api/types/user';
import { Organizer } from '../../lib/api/types/organizer';
import { RoleName } from '../../lib/api/types/role';
import { AdminContext } from '../Admin/AdminContext';
import { useSetOrganizerId } from '../../lib/useOrganizer';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;

export type WrappedUser = {
  user: User;
  authToken: string;
  isLoggedIn: boolean;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => Promise<void>;
  mutateUserInfo: () => void;
  isSuperuser: boolean;
};

export const useUser = (): WrappedUser => {
  const authTokenCookieName = publicRuntimeConfig?.authTokenCookieName || 'AUTH_TOKEN';

  const { authToken, user, isAuthenticated, login, logout, mutate } = useContext(UserContext);
  const setOrganizerId = useSetOrganizerId();

  const authTokenFromStateOrCookie = useMemo(
    () => authToken || getCookie(authTokenCookieName)?.value,
    [authToken, authTokenCookieName]
  );

  const { setActiveOrganizerId: setAdminOrganizerId, setAdminModeActive } =
    useContext(AdminContext);

  return {
    user: user,
    authToken: authTokenFromStateOrCookie,
    isLoggedIn: isAuthenticated,
    login,
    logout: async () => {
      setAdminOrganizerId(undefined);
      setAdminModeActive(false);
      setOrganizerId(undefined);
      await logout();
    },
    mutateUserInfo: mutate,
    isSuperuser: user?.attributes?.isSuperuser,
  };
};

export const useUserOrganizerLists = (): {
  all: Organizer['data'][];
  owner: Organizer['data'][];
  contributor: Organizer['data'][];
} => {
  const { user } = useUser();

  const organizerOwnerList = useMemo(
    () =>
      user?.relations?.organizers
        ?.filter((role) => role.attributes?.role === RoleName.owner)
        ?.map((role) => role.relations?.organizer as Organizer['data']) || [],
    [user?.relations?.organizers]
  );

  const organizerContributorList = useMemo(
    () =>
      user?.relations?.organizers
        ?.filter((role) => role.attributes?.role !== RoleName.owner)
        ?.map((role) => role.relations?.organizer as Organizer['data']) || [],
    [user?.relations?.organizers]
  );

  return {
    all:
      user?.relations?.organizers?.map((role) => role.relations?.organizer as Organizer['data']) ||
      [],
    owner: organizerOwnerList,
    contributor: organizerContributorList,
  };
};
