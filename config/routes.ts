import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import { useEffect, useState } from 'react';

export type Route = (query?: ParsedUrlQuery) => string;

export enum Routes {
  index = 'index',
  dashboard = 'dashboard',
  login = 'login',
  register = 'register',
  userProfile = 'userProfile',
  providers = 'providers',
  provider = 'provider',
}

export const routes: { [key in Routes]: Route } = {
  index: () => '/',
  dashboard: () => '/app/',
  userProfile: () => '/app/user/profile/',
  login: () => '/app/auth/login/',
  register: () => '/app/auth/register/',
  providers: () => '/app/providers/',
  provider: (query?: { entry: string }) => `${routes.providers()}${query?.entry}/`,
};

export const isRouteActive = (
  currentRoute: string,
  route: Routes,
  query?: ParsedUrlQuery
): boolean => currentRoute === routes[route](query);

export const getActiveRoute = (currentRoute: string, query?: ParsedUrlQuery): Routes => {
  const foundRoute = Object.entries(routes).find(([, route]) => route(query) === currentRoute);

  return foundRoute ? (foundRoute[0] as Routes) : undefined;
};

export const useIsRouteStringActive = (routeString: string): boolean => {
  const [isActive, setIsActive] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    setIsActive(routeString === router.asPath);
  }, [router, routeString]);

  return isActive;
};

export const useIsRouteActive = (route: Routes, query: ParsedUrlQuery): boolean => {
  const [routeActive, setRouteActive] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    setRouteActive(isRouteActive(router.asPath, route, query));
  }, [route, router, query]);

  return routeActive;
};

export const useActiveRoute = (): Routes => {
  const [route, setRoute] = useState<Routes>();
  const router = useRouter();

  useEffect(() => {
    setRoute(getActiveRoute(router.asPath, router.query));
  }, [router]);

  return route;
};
