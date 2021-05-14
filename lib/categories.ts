import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import React from 'react';
import useSWR from 'swr';
import { Categories, useCategories } from '../config/categories';
import { ApiCallFactory, ApiRoutes, getApiUrlString, useApiCall } from './api';
import { Route } from './routing';

export type categoryApi = {
  route: ApiRoutes;
  factory: ApiCallFactory;
};

export interface CategoryPage {
  category: Category;
}

export interface CategoryEntryPage extends CategoryPage {
  entry: CategoryEntry;
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
  };
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

export const useList = () => null;

export const useEntry = (category: Category, query: ParsedUrlQuery): CategoryEntry => {
  const call = useApiCall();

  const apiCallFactory = category?.api.show.factory;
  const apiCallRoute = category?.api.show.route;

  const { data } = useSWR(
    apiCallRoute && query ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (apiCallRoute && query ? call(apiCallFactory, query) : undefined)
  );

  return (data?.body as any)?.data;
};
