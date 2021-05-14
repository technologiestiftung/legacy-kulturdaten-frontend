import { useRouter } from 'next/router';
import React from 'react';
import { Categories, useCategories } from '../config/categories';
import { ApiCallFactory, ApiRoutes } from './api';
import { Route } from './routing';

export type categoryApi = {
  route: ApiRoutes;
  factory: ApiCallFactory;
};

export interface CategoryPage {
  category: Category;
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

export const useEntry = () => null;
