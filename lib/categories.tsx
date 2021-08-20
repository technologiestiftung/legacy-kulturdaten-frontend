import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import React, { useContext } from 'react';
import useSWR, { mutate as mutateSwr } from 'swr';
import { Button, ButtonVariant } from '../components/button';
import { EntryListContext } from '../components/EntryList/EntryListContext';
import { MenuIconName } from '../components/navigation/Menu/MenuIcon';
import { Tabs, TabsProps } from '../components/navigation/tabs';
import { Categories, Requirement, useCategories } from '../config/categories';
import { Language } from '../config/locale';
import { ApiCall, ApiCallFactory, ApiRoutes, getApiUrlString, useApiCall } from './api';
import { OrganizerTypeList, organizerTypeListFactory } from './api/routes/organizerType/list';
import { DefaultAttributes, Translation } from './api/types/general';
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
  data: {
    attributes?: DefaultAttributes;
    relations?: {
      translations?: Translation[];
    };
  };
  meta?: {
    publishable: boolean | { [key: string]: string[] };
    language?: Language;
  };
}

export type Category = {
  name: Categories;
  title: {
    singular: string;
    plural: string;
  };
  icon: MenuIconName;
  subMenuKey?: string;
  routes: {
    list: Route;
    create: Route;
  };
  pages: {
    create: React.FC<CategoryPage>;
    info: React.FC<CategoryEntryPage>;
    media: React.FC<CategoryEntryPage>;
    list: React.FC<CategoryPage>;
  } & { [key: string]: React.FC<CategoryEntryPage> };
  tabs: {
    title: string;
    sub?: string;
  }[];
  metaLinks: {
    title: string;
    icon: string;
  }[];
  api: {
    list: categoryApi;
    show: categoryApi;
    create: categoryApi;
    update: categoryApi;
    translationCreate: categoryApi;
    delete: categoryApi;
  };
  requirements?: Requirement[];
};

export const useCategory = (): Category => {
  const router = useRouter();
  const categories = useCategories();
  const categoryName = router?.query?.category as Categories;
  const category = categories[categoryName];

  return category;
};

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

const makeListQuery = (
  page?: number,
  size?: number,
  filter?: [string, string][],
  sort?: { key: string; order: Order }
) => {
  return {
    page: page ? String(page) : undefined,
    size: size ? String(size) : undefined,
    filter: filter
      ? filter
          .filter((currentFilter) => currentFilter[1] !== undefined && currentFilter.length > 0)
          .map(([key, value]) => `${key}=${value}`)
          .join(',')
      : undefined,
    sort: sort ? `${sort.order === Order.ASC ? '' : '-'}${sort.key}` : undefined,
  };
};

export const useList = <C extends ApiCall, T extends CategoryEntry>(
  category: Category,
  page?: number,
  size?: number,
  filter?: [string, string][],
  sort?: { key: string; order: Order },
  load = true
): {
  data: T['data'][];
  meta: {
    language: Language;
    pages: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
  };
} => {
  const call = useApiCall();
  const apiCallFactory = category?.api.list.factory;
  const apiCallRoute = category?.api.list.route;

  const query = makeListQuery(page, size, filter, sort);

  const { data } = useSWR(
    load && apiCallRoute ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (load && category ? call<C>(apiCallFactory, query) : undefined)
  );

  return {
    data: (((data as unknown) as C['response'])?.body?.data as unknown) as T['data'][],
    meta: ((data as unknown) as C['response'])?.body?.meta as {
      language: Language;
      pages: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
      };
    },
  };
};

export const useMutateList = (category: Category): (() => void) => {
  const {
    getCurrentPage: getPage,
    getEntriesPerPage: getSize,
    getFilters,
    getSortKey,
    getOrder,
  } = useContext(EntryListContext);
  const apiCallRoute = category?.api.list.route;
  const query = makeListQuery(
    getPage(category.name),
    getSize(category.name),
    Object.entries(getFilters(category.name)),
    { key: getSortKey(category.name), order: getOrder(category.name) }
  );

  return () => mutateSwr(getApiUrlString(apiCallRoute, query));
};

export const useEntry = <T extends CategoryEntry, C extends ApiCall>(
  category: Category,
  query: ParsedUrlQuery
): {
  entry: T;
  mutate: (entry?: T, shouldRevalidate?: boolean) => Promise<C['response'] | undefined>;
} => {
  const call = useApiCall();

  const apiCallFactory = category?.api.show.factory;
  const apiCallRoute = category?.api.show.route;

  const { data, mutate } = useSWR<C['response']>(
    apiCallRoute && query ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (apiCallRoute && query ? call(apiCallFactory, query) : undefined)
  );

  const wrappedMutate = (entry?: T, shouldRevalidate?: boolean) =>
    mutate(
      entry ? (({ status: 200, body: { data: entry } } as unknown) as C['response']) : undefined,
      shouldRevalidate
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { entry: ((data?.body as any) as unknown) as T, mutate: wrappedMutate };
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

export const useMetaLinks = (category: Category): React.ReactElement[] => {
  const metaLinks = category?.metaLinks?.map(({ title, icon }, index) => {
    return (
      <Button key={index} icon={icon} variant={ButtonVariant.minimal}>
        {title}
      </Button>
    );
  });

  return metaLinks;
};

export const useOrganizerTypeList = (): OrganizerType[] => {
  const call = useApiCall();

  const { data } = useSWR(
    getApiUrlString(ApiRoutes.organizerTypeList, undefined),
    () => call<OrganizerTypeList>(organizerTypeListFactory, undefined),
    { revalidateOnFocus: false, focusThrottleInterval: 1000 * 60 * 5 }
  );

  return data?.body?.data;
};
