import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';

import { routes, Routes } from '../config/routes';
import { Language, Locale } from '../config/locale';
import { localeLanguageMap } from '../config/locales';
import { setCookie } from './cookies';

export type Route = (props: { locale: Locale; query?: ParsedUrlQuery }) => string;

export const isRouteActive = (
  currentRoute: string,
  route: Routes,
  locale: Locale,
  query?: ParsedUrlQuery
): boolean => currentRoute === routes[route]({ locale, query });

const getActiveRoute = (currentRoute: string, locale: Locale, query?: ParsedUrlQuery): Routes => {
  const foundRoute = Object.entries(routes).find(
    ([, route]) => route({ locale, query }) === currentRoute
  );

  return foundRoute ? (foundRoute[0] as Routes) : undefined;
};

/**
 * States if a given route string represents the currently active route
 * @param routeString - The route as a string
 * @returns If the route is active
 */
export const useIsRouteStringActive = (routeString: string): boolean => {
  const [isActive, setIsActive] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    setIsActive(routeString === router?.asPath.split('#')[0]);
  }, [router, routeString]);

  return isActive;
};

/**
 * States if a given route if the currently active route
 * @param route - The route as a Route object
 * @param locale - The locale
 * @param query - Optional query parameters
 * @returns If the route is active
 */
export const useIsRouteActive = (
  route: Routes,
  locale: Locale,
  query?: ParsedUrlQuery
): boolean => {
  const [routeActive, setRouteActive] = useState<boolean>();
  const router = useRouter();

  useEffect(() => {
    setRouteActive(isRouteActive(router?.asPath.split('#')[0], route, locale, query));
  }, [route, router, locale, query]);

  return routeActive;
};

/**
 * Provides the currently active route identifier
 * @returns The currently active route as a Routes enum identifier
 */
export const useActiveRoute = (): Routes => {
  const [route, setRoute] = useState<Routes>();
  const router = useRouter();

  useEffect(() => {
    const activeRouteWithoutAnchor = router?.asPath.split('#')[0];

    setRoute(getActiveRoute(activeRouteWithoutAnchor, router?.locale as Locale, router?.query));
  }, [router]);

  return route;
};

/**
 * Provides the current Locale
 * @returns The current Locale
 */
export const useLocale = (): Locale => {
  const router = useRouter();
  const locale = useMemo<Locale>(
    () => (router?.locale as Locale) || Locale['de-DE'],
    [router?.locale]
  );

  return locale;
};

export const useLanguage = (): Language => {
  const locale = useLocale();

  return locale && localeLanguageMap
    ? localeLanguageMap[locale]
    : localeLanguageMap[Locale['de-DE']];
};

const setUserLocalePreference = (locale: Locale): void => {
  // Sets Next.js compatible cookie for locale routing
  setCookie({
    'name': 'NEXT_LOCALE',
    'value': locale,
    'path': '/',
    'max-age': 365 * 24 * 60 * 60,
  });
};

/**
 * Provides a function to switch the locale in the frontend
 * @returns The function to switch the locale
 */
export const useSwitchLocale = (): ((locale: Locale) => void) => {
  const router = useRouter();
  const activeRoute = useActiveRoute();

  return (locale: Locale) => {
    router.push(routes[activeRoute]({ locale, query: router.query }), null, { locale });
    setUserLocalePreference(locale);
  };
};

export { routes, Routes };
