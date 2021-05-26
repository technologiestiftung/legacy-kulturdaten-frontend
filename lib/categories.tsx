import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import React from 'react';
import useSWR from 'swr';
import { MenuIconName } from '../components/navigation/mainMenu/MenuIcon';
import { Tabs, TabsProps } from '../components/navigation/tabs';
import { TitleBarProps } from '../components/navigation/TitleBar';
import { Categories, useCategories } from '../config/categories';
import { ApiCall, ApiCallFactory, ApiRoutes, getApiUrlString, useApiCall } from './api';
import { OrganizerTypeList, organizerTypeListFactory } from './api/routes/organizerType/list';
import { OrganizerType } from './api/types/organizer';
import { Route, useLocale } from './routing';

export type categoryApi = {
  route: ApiRoutes;
  factory: ApiCallFactory;
};

export interface CategoryPage {
  category: Category;
}

export interface CategoryEntryPage extends CategoryPage {
  query: ParsedUrlQuery;
}

export interface CategoryEntry {
  attributes: {
    name: string;
  };
}

export type Category = {
  name: Categories;
  title: {
    singular: string;
    plural: string;
  };
  icon: MenuIconName;
  menuFactory: (
    category: Category,
    list: any
  ) => { titleBar: React.ReactElement<TitleBarProps>; content: React.ReactElement };
  routes: {
    list: Route;
    create: Route;
  };
  pages: {
    list: React.FC<CategoryPage>;
    create: React.FC<CategoryPage>;
    overview: React.FC<CategoryEntryPage>;
    info: React.FC<CategoryEntryPage>;
    rights: React.FC<CategoryEntryPage>;
    export: React.FC<CategoryEntryPage>;
  };
  tabs: {
    title: string;
    sub?: string;
  }[];
  api: {
    list: categoryApi;
    show: categoryApi;
    create: categoryApi;
    update: categoryApi;
    delete: categoryApi;
  };
};

export const useCategory = (): Category => {
  const router = useRouter();
  const categories = useCategories();
  const categoryName = router?.query?.category as Categories;
  const category = categories[categoryName];

  return category;
};

export const useList = <C extends ApiCall, T extends CategoryEntry[]>(
  category: Category,
  query?: ParsedUrlQuery,
  load = true
): T => {
  const call = useApiCall();

  const apiCallFactory = category?.api.list.factory;
  const apiCallRoute = category?.api.list.route;

  const { data } = useSWR(load && apiCallRoute ? getApiUrlString(apiCallRoute) : undefined, () =>
    load && category ? call<C>(apiCallFactory, query) : undefined
  );

  return (((data as unknown) as C['response'])?.body?.data as unknown) as T;
};

export const useEntry = <T extends CategoryEntry, C extends ApiCall>(
  category: Category,
  query: ParsedUrlQuery
): {
  entry: T;
  mutate: (data?: C['response'], shouldRevalidate?: boolean) => Promise<C['response'] | undefined>;
} => {
  const call = useApiCall();

  const apiCallFactory = category?.api.show.factory;
  const apiCallRoute = category?.api.show.route;

  const { data, mutate } = useSWR<C['response']>(
    apiCallRoute && query ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (apiCallRoute && query ? call(apiCallFactory, query) : undefined)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { entry: ((data?.body as any)?.data as unknown) as T, mutate };
};

export const useTabs = (category: Category): React.ReactElement<TabsProps> => {
  const router = useRouter();
  const locale = useLocale();

  const tabLinks = category?.tabs.map(({ title, sub }) => {
    const href = `${category?.routes.list({ locale, query: { ...router.query, sub } })}`;

    return {
      title,
      href,
      isActive: router.asPath === href,
    };
  });

  if (tabLinks?.length > 0) {
    return <Tabs links={tabLinks} />;
  }

  return null;
};

export const useCategoryMenu = (
  category: Category,
  list: any
): { titleBar: React.ReactElement<TitleBarProps>; content: React.ReactElement } => {
  const categoryMenu = category.menuFactory(category, list);

  return categoryMenu;
};

export const useOrganizerTypeList = (): OrganizerType[] => {
  const call = useApiCall();

  const { data } = useSWR(
    getApiUrlString(ApiRoutes.organizerTypeList),
    () => call<OrganizerTypeList>(organizerTypeListFactory),
    { revalidateOnFocus: false, focusThrottleInterval: 1000 * 60 * 5 }
  );

  return data?.body?.data;
};
