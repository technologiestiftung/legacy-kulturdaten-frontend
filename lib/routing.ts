import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';

import { Locale, routes, Routes } from '../config/routes';

export type Route = (props: { locale: Locale; query?: ParsedUrlQuery }) => string;

export const isRouteActive = (
  currentRoute: string,
  route: Routes,
  locale: Locale,
  query?: ParsedUrlQuery
): boolean => currentRoute === routes[route]({ locale, query });

export const getActiveRoute = (
  currentRoute: string,
  locale: Locale,
  query?: ParsedUrlQuery
): Routes => {
  const foundRoute = Object.entries(routes).find(
    ([, route]) => route({ locale, query }) === currentRoute
  );

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

export const useIsRouteActive = (
  route: Routes,
  locale: Locale,
  query?: ParsedUrlQuery
): boolean => {
  const [routeActive, setRouteActive] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    setRouteActive(isRouteActive(router.asPath, route, locale, query));
  }, [route, router, locale, query]);

  return routeActive;
};

export const useActiveRoute = (): Routes => {
  const [route, setRoute] = useState<Routes>();
  const router = useRouter();

  useEffect(() => {
    setRoute(getActiveRoute(router.asPath, router.locale as Locale, router.query));
  }, [router]);

  return route;
};

export const useLocale = (): Locale => {
  const [locale, setLocale] = useState<Locale>();
  const router = useRouter();

  useEffect(() => {
    setLocale(router.locale as Locale);
  }, [router]);

  return locale;
};

export { routes, Routes };
