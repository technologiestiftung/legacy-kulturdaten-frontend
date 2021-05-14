import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import React from 'react';
import useSWR from 'swr';
import { Tabs, TabsProps } from '../components/navigation/tabs';
import { Categories, useCategories } from '../config/categories';
import { ApiCall, ApiCallFactory, ApiRoutes, getApiUrlString, useApiCall } from './api';
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
  title: {
    singular: string;
    plural: string;
  };
  routes: {
    list: Route;
    create: Route;
  };
  pages: {
    list: React.FC<CategoryPage>;
    create: React.FC<CategoryPage>;
    show: React.FC<CategoryEntryPage>;
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
  query?: ParsedUrlQuery
): T => {
  const call = useApiCall();

  const apiCallFactory = category?.api.list.factory;
  const apiCallRoute = category?.api.list.route;

  const { data } = useSWR(apiCallRoute ? getApiUrlString(apiCallRoute) : undefined, () =>
    category ? call<C>(apiCallFactory, query) : undefined
  );

  return (((data as unknown) as C['response'])?.body?.data as unknown) as T;
};

export const useEntry = <C extends ApiCall, T extends CategoryEntry>(
  category: Category,
  query: ParsedUrlQuery
): T => {
  const call = useApiCall();

  const apiCallFactory = category?.api.show.factory;
  const apiCallRoute = category?.api.show.route;

  const { data } = useSWR(
    apiCallRoute && query ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (apiCallRoute && query ? call<C>(apiCallFactory, query) : undefined)
  );

  return (((data as unknown) as C['response'])?.body?.data as unknown) as T;
};

export const useTabs = (category: Category): React.ReactElement<TabsProps> => {
  const router = useRouter();
  const locale = useLocale();

  const tabLinks = category.tabs.map(({ title, sub }) => {
    const href = `${category?.routes.list({ locale, query: { ...router.query, sub } })}`;

    return {
      title,
      href,
      isActive: router.asPath === href,
    };
  });

  if (tabLinks.length > 0) {
    return <Tabs links={tabLinks} />;
  }

  return null;
};
