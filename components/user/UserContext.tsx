import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import getConfig from 'next/config';

import { Cookie, deleteCookie, getCookie, setCookie } from '../../lib/cookies';
import { User } from '../../lib/api/types/user';
import useSWR from 'swr';
import {
  ApiRoutes,
  AuthInfo,
  authInfoFactory,
  AuthLogout,
  authLogoutFactory,
  AuthValidate,
  authValidateFactory,
  getApiUrlString,
  useApiCall,
} from '../../lib/api';
import { internalRoutes, Routes, routes } from '../../config/routes';
import { useActiveRoute, useLocale } from '../../lib/routing';
import { useRouter } from 'next/router';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useT } from '../../lib/i18n';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;

const activeOrganizerCookieName =
  publicRuntimeConfig?.activeOrganizerCookieName || 'ACTIVE_ORGANIZER_ID';

type UserContext = {
  authToken: string;
  setAuthToken: (authToken: string) => void;
  user: User;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  authenticateUser: () => void;
  invalidateUser: () => void;
  rand: number;
  login: (cookie: Cookie, redirectRoute: string) => void;
  logout: () => Promise<void>;
  mutate: () => void;
  acceptedTerms: boolean;
  requestedDeletion: boolean;
  userInactive: boolean;
};

export const UserContext = React.createContext<UserContext>({
  authToken: undefined,
  setAuthToken: () => undefined,
  user: null,
  setUser: () => undefined,
  isAuthenticated: false,
  authenticateUser: () => undefined,
  invalidateUser: () => undefined,
  rand: Math.random() * 100,
  login: () => undefined,
  logout: () => undefined,
  mutate: () => undefined,
  acceptedTerms: true,
  requestedDeletion: false,
  userInactive: false,
});

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}: UserContextProviderProps) => {
  const authTokenCookieName = publicRuntimeConfig?.authTokenCookieName || 'AUTH_TOKEN';
  const [authToken, setAuthToken] = useState<string>();
  const [stateUser, setStateUser] = useState<User>();
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(false);
  const [rand] = useState<number>(Math.random() * 100);
  const locale = useLocale();
  const activeRoute = useActiveRoute();
  const router = useRouter();
  const loadingScreen = useLoadingScreen();
  const t = useT();

  const isInternalRoute = useMemo(() => internalRoutes.includes(activeRoute), [activeRoute]);

  const acceptedTerms = useMemo(
    () => !stateUser?.id || stateUser?.attributes?.hasAcceptedCurrentTerms,
    [stateUser]
  );

  const requestedDeletion = useMemo(
    () => stateUser?.id && stateUser?.attributes.deletionRequestedAt?.length > 0,
    [stateUser?.attributes?.deletionRequestedAt?.length, stateUser?.id]
  );

  useEffect(() => {
    setAuthToken(getCookie(authTokenCookieName)?.value);
  }, [setAuthToken, authTokenCookieName]);

  const authTokenFromStateOrCookie = useMemo(
    () => authToken || getCookie(authTokenCookieName)?.value,
    [authToken, authTokenCookieName]
  );

  const call = useApiCall(authTokenFromStateOrCookie);

  const [userTokenIsValid, setUserTokenIsValid] = useState<boolean>();

  const { data: userResponse, mutate: mutateUserInfo } = useSWR(
    [getApiUrlString(ApiRoutes.authInfo), authTokenFromStateOrCookie],
    () => (authTokenFromStateOrCookie ? call<AuthInfo>(authInfoFactory) : undefined)
  );

  const { data, mutate: mutateValidate } = useSWR(
    [getApiUrlString(ApiRoutes.authValidate), authTokenFromStateOrCookie],
    (url: string, requestAuthToken: string) =>
      requestAuthToken
        ? call<AuthValidate>(authValidateFactory)
        : { body: { meta: { valid: undefined } } }
  );

  useEffect(() => {
    setUserTokenIsValid(data?.body?.meta?.valid);
  }, [data?.body?.meta?.valid]);

  const authenticateUser = useCallback(() => {
    setUserIsAuthenticated(true);
  }, []);

  const invalidateUser = useCallback(() => {
    setAuthToken(undefined);
    setStateUser(undefined);
    setUserIsAuthenticated(undefined);
  }, []);

  const logoutUser = useCallback(() => {
    if (authTokenFromStateOrCookie) {
      call<AuthLogout>(authLogoutFactory).catch((e) => console.error(e));
    }
    deleteCookie({ name: authTokenCookieName, path: routes.index({ locale }) } as Cookie);
    deleteCookie({ name: activeOrganizerCookieName, path: routes.index({ locale }) } as Cookie);
    mutateValidate(undefined);
    setUserTokenIsValid(false);
    invalidateUser();
  }, [
    authTokenFromStateOrCookie,
    authTokenCookieName,
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
          if (userTokenIsValid === true && !userIsAuthenticated) {
            setStateUser(userObject.data);
            setAuthToken(authTokenFromStateOrCookie);
            authenticateUser();
          } else {
            setStateUser(userObject.data);
          }
        }
      }
    } else if (userIsAuthenticated) {
      logoutUser();
    } else {
      if (
        locale &&
        isInternalRoute &&
        activeRoute !== Routes.login &&
        `${router.pathname}/` !== routes.login({ locale })
      ) {
        router.replace(routes.login({ locale, query: { redirect: router.asPath } }));
      }
    }
  }, [
    isInternalRoute,
    authTokenFromStateOrCookie,
    authenticateUser,
    locale,
    logoutUser,
    router,
    setAuthToken,
    userIsAuthenticated,
    userResponse?.body,
    userTokenIsValid,
    activeRoute,
  ]);

  useEffect(() => {
    if (
      !requestedDeletion &&
      userIsAuthenticated &&
      isInternalRoute &&
      acceptedTerms === false &&
      activeRoute !== Routes.userSettings
    ) {
      router.replace(routes.userSettings({ locale }));
    }
  }, [
    requestedDeletion,
    userIsAuthenticated,
    acceptedTerms,
    locale,
    router,
    isInternalRoute,
    activeRoute,
  ]);

  useEffect(() => {
    if (
      requestedDeletion &&
      userIsAuthenticated &&
      isInternalRoute &&
      activeRoute !== Routes.userDeletion
    ) {
      router.replace(routes.userDeletion({ locale }));
    }
  }, [activeRoute, isInternalRoute, locale, requestedDeletion, router, userIsAuthenticated]);

  const login = useCallback(
    (cookie: Cookie, redirectRoute: string) => {
      setUserTokenIsValid(true);
      mutateValidate({ body: { meta: { valid: true } } });
      setAuthToken(cookie.value);
      setCookie(cookie);
      router.push(redirectRoute);

      setTimeout(() => {
        if (router.asPath !== redirectRoute) {
          router.replace(redirectRoute);
        }
      }, 1500);
    },
    [mutateValidate, router]
  );

  const logout = useCallback(async () => {
      async () => {
        logoutUser();

        setTimeout(() => {
          router.push(routes.login({ locale }));
        }, 500);

        return { success: true };
      }
  }, [ locale, logoutUser, router, t]);

  return (
    <UserContext.Provider
      value={{
        authToken,
        setAuthToken,
        user: stateUser,
        setUser: (initialUser: User) => setStateUser(initialUser),
        isAuthenticated: userIsAuthenticated,
        authenticateUser,
        invalidateUser,
        rand,
        login,
        logout,
        mutate: mutateUserInfo,
        acceptedTerms: acceptedTerms !== false,
        requestedDeletion,
        userInactive: acceptedTerms === false || requestedDeletion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthToken = (): string => {
  const { authToken } = useContext(UserContext);

  return authToken;
};
