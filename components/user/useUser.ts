import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';

import {
  AuthValidate,
  authValidateFactory,
  AuthInfo,
  authInfoFactory,
  AuthLogout,
  authLogoutFactory,
  getApiUrlString,
  ApiRoutes,
  useApiCall,
} from '../../lib/api';
import { UserContext } from './UserContext';
import { useRouter } from 'next/router';
import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { routes, useActiveRoute, useLocale } from '../../lib/routing';
import { User } from '../../lib/api/types/user';
import { internalRoutes } from '../../config/routes';
import { useOrganizerId, useSetOrganizerId, defaultOrganizerId } from '../../lib/useOrganizer';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useT } from '../../lib/i18n';
import { Organizer } from '../../lib/api/types/organizer';
import { RoleName } from '../../lib/api/types/role';
import { AdminContext } from '../Admin/AdminContext';

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
  const activeOrganizerCookieName =
    publicRuntimeConfig?.activeOrganizerCookieName || 'ACTIVE_ORGANIZER_ID';

  const {
    authToken,
    setAuthToken,
    user,
    setUser,
    invalidateUser,
    isAuthenticated,
    authenticateUser,
  } = useContext(UserContext);

  const authTokenFromStateOrCookie = useMemo(
    () => authToken || getCookie(authTokenCookieName)?.value,
    [authToken, authTokenCookieName]
  );

  const router = useRouter();
  const locale = useLocale();
  const call = useApiCall(authTokenFromStateOrCookie);
  const activeRoute = useActiveRoute();
  const loadingScreen = useLoadingScreen();
  const activeOrganizerId = useOrganizerId();
  const setActiveOrganizerId = useSetOrganizerId();
  const { setActiveOrganizerId: setAdminOrganizerId, setAdminModeActive } =
    useContext(AdminContext);
  const t = useT();

  const { data, mutate: mutateValidate } = useSWR(
    [getApiUrlString(ApiRoutes.authValidate), authTokenFromStateOrCookie],
    (url: string, requestAuthToken: string) =>
      requestAuthToken
        ? call<AuthValidate>(authValidateFactory)
        : { body: { meta: { valid: undefined } } }
  );

  const [userTokenIsValid, setUserTokenIsValid] = useState<boolean>();

  useEffect(() => {
    setUserTokenIsValid(data?.body?.meta?.valid);
  }, [data?.body?.meta?.valid]);

  const { data: userResponse, mutate: mutateUserInfo } = useSWR(
    getApiUrlString(ApiRoutes.authInfo),
    () => (authTokenFromStateOrCookie ? call<AuthInfo>(authInfoFactory) : undefined)
  );

  const logoutUser = useCallback(() => {
    if (authTokenFromStateOrCookie) {
      call<AuthLogout>(authLogoutFactory).catch((e) => console.error(e));
    }
    setAdminOrganizerId(undefined);
    setAdminModeActive(false);
    deleteCookie({ name: authTokenCookieName, path: routes.index({ locale }) } as Cookie);
    deleteCookie({ name: activeOrganizerCookieName, path: routes.index({ locale }) } as Cookie);
    mutateValidate(undefined);
    setUserTokenIsValid(false);
    invalidateUser();
  }, [
    setAdminModeActive,
    setAdminOrganizerId,
    authTokenFromStateOrCookie,
    authTokenCookieName,
    activeOrganizerCookieName,
    locale,
    mutateValidate,
    invalidateUser,
    call,
  ]);

  useEffect(() => {
    const userObject = userResponse?.body as unknown as AuthInfo['response']['body'];

    if (authTokenFromStateOrCookie) {
      if (userTokenIsValid === false) {
        logoutUser();
      } else {
        if (userObject) {
          if (userTokenIsValid === true && !isAuthenticated) {
            setUser(userObject.data);
            setAuthToken(authTokenFromStateOrCookie);
            authenticateUser();
          } else {
            setUser(userObject.data);
          }

          const userOrganizerIds = userObject.data?.relations?.organizers?.map(
            (role) => role.relations?.organizer?.id
          );

          if (userOrganizerIds?.length > 0 && !userOrganizerIds.includes(activeOrganizerId)) {
            setActiveOrganizerId(userOrganizerIds[0]);
          } else if (userOrganizerIds?.length === 0 && activeOrganizerId !== defaultOrganizerId) {
            setActiveOrganizerId(defaultOrganizerId);
          }
        }
      }
    } else if (isAuthenticated) {
      logoutUser();
    } else {
      if (locale && internalRoutes.includes(activeRoute)) {
        router.replace(routes.login({ locale }));
      }
    }
  }, [
    isAuthenticated,
    authenticateUser,
    userResponse,
    setUser,
    router,
    userTokenIsValid,
    logoutUser,
    locale,
    authTokenFromStateOrCookie,
    setAuthToken,
    mutateValidate,
    activeRoute,
    activeOrganizerId,
    setActiveOrganizerId,
  ]);

  return {
    user: user,
    authToken: authTokenFromStateOrCookie,
    isLoggedIn: isAuthenticated,
    login: (cookie: Cookie, redirectRoute: string) => {
      setAuthToken(cookie.value);
      setCookie(cookie);
      mutateValidate({ body: { meta: { valid: true } } });
      setUserTokenIsValid(true);
      router.replace(redirectRoute);
    },
    logout: async () => {
      loadingScreen(
        t('logout.loading'),
        async () => {
          logoutUser();

          setTimeout(() => {
            router.push(routes.login({ locale }));
          }, 500);

          return { success: true };
        },
        t('logout.loadingMessage')
      );
    },
    mutateUserInfo,
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
