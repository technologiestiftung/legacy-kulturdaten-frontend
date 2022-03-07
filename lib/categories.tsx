import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'node:querystring';
import React, { useCallback, useContext, useMemo } from 'react';
import useSWR, { mutate as mutateSwr } from 'swr';
import { EntryListContext } from '../components/EntryList/EntryListContext';
import { MenuIconName } from '../components/navigation/Menu/MenuIcon';
import { Tabs, TabsProps } from '../components/navigation/tabs';
import { useUser, useUserOrganizerLists } from '../components/user/useUser';
import { Categories, Requirement, useCategories } from '../config/categories';
import { Language } from '../config/locale';
import { ApiCall, ApiCallFactory, ApiRoute, ApiRoutes, getApiUrlString, useApiCall } from './api';
import { OfferDateList, offerDateListFactory } from './api/routes/offer/date/list';
import { OfferMainTypeList, offerMainTypeListFactory } from './api/routes/offerMainType/list';
import { OfferTypeList, offerTypeListFactory } from './api/routes/offerType/list';
import { OrganizerTypeList, organizerTypeListFactory } from './api/routes/organizerType/list';
import { CategoryEntry } from './api/types/general';
import { LocationType } from './api/types/location';
import { OfferDate, OfferType, OfferMainType } from './api/types/offer';
import { OrganizerType } from './api/types/organizer';
import { EntryType } from './api/types/typeSubject';
import { useT } from './i18n';
import { Route, useActiveRoute, useLanguage, useLocale } from './routing';
import { useOrganizerId, useSetOrganizerId } from './useOrganizer';
import { routes, Routes } from '../config/routes';
import { MediaLicense } from './api/types/media';
import { MediaLicenseList, mediaLicenseListFactory } from './api/routes/mediaLicense/list';
import { District } from './api/types/district';
import { DistrictList, districtListFactory } from './api/routes/district/list';
import { defaultOrganizerId } from '../components/navigation/NavigationContext';
import { sortByTranslation } from './sortTranslations';
import { useAuthToken } from '../components/user/UserContext';

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

export enum CategoryExportType {
  entry = 'entry',
  list = 'list',
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
    'info': React.FC<CategoryEntryPage>;
    'media': React.FC<CategoryEntryPage>;
    'list': React.FC<CategoryEntryPage>;
    '404': React.FC<CategoryEntryPage>;
  } & { [key: string]: React.FC<CategoryEntryPage> };
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
    media?: categoryApi;
    typeList?: categoryApi;
  };
  options: {
    export: {
      format: string;
      title: string;
      route: ApiRoute;
      type: CategoryExportType;
      fileNameFactory?: (...args: string[]) => string;
    }[];
    deletion: {
      title: string;
      message: (name: string) => string;
      button: string;
      deleting: string;
      condition?: {
        label: string;
        error: string;
      };
    };
  };
  requirements?: Requirement[];
  publishText: string;
  placeholderName: string;
};

export const useCategory = (): Category => {
  const router = useRouter();
  const categories = useCategories();
  const categoryName = router?.query?.category as Categories;

  if (categoryName && categoryName.length > 0) {
    const category = categories[categoryName];
    return category;
  } else {
    return categories['organizer'];
  }
};

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

const makeListQuery = (
  page?: number,
  perPage?: number,
  filter?: [string, string][],
  sort?: { key: string; order: Order },
  search?: string,
  includes?: string[]
) => {
  return {
    page: page ? String(page) : undefined,
    size: perPage ? String(perPage) : undefined,
    filter: filter
      ? filter
          .filter((currentFilter) => currentFilter[1] !== undefined && currentFilter.length > 0)
          .map(([key, value]) => `${key}=${value}`)
          .join(',')
      : undefined,
    sort: sort ? `${sort.order === Order.ASC ? '' : '-'}${sort.key}` : undefined,
    search: search ? search : undefined,
    includes: includes ? includes : undefined,
  };
};

export const useOfferDateList = (
  offerId: number | string,
  page?: number,
  perPage?: number,
  filter?: [string, string][],
  sort?: { key: string; order: Order },
  load = true
): {
  data: OfferDate['data'][];
  meta: {
    language: Language;
    pages: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
  };
  mutate: (
    data?: OfferDateList['response'],
    shouldRevalidate?: boolean
  ) => Promise<OfferDateList['response'] | undefined>;
} => {
  const call = useApiCall();
  const query = makeListQuery(page, perPage, filter, sort);

  const { data, mutate } = useSWR(
    load && offerId
      ? getApiUrlString(ApiRoutes.offerDateList, { ...query, offerId: String(offerId) })
      : undefined,
    () =>
      load && offerId
        ? call<OfferDateList>(offerDateListFactory, { ...query, offerId: String(offerId) })
        : undefined
  );

  return {
    data: (data as unknown as OfferDateList['response'])?.body
      ?.data as unknown as OfferDate['data'][],
    meta: (data as unknown as OfferDateList['response'])?.body?.meta as {
      language: Language;
      pages: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
      };
    },
    mutate,
  };
};

export const useList = <C extends ApiCall, T extends CategoryEntry>(
  category: Category,
  page?: number,
  perPage?: number,
  filter?: [string, string][],
  sort?: { key: string; order: Order },
  load = true,
  search?: string,
  additionalIncludes?: string[]
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
  const query = makeListQuery(page, perPage, filter, sort, search, additionalIncludes);
  const authToken = useAuthToken();

  const { data } = useSWR(
    load && apiCallRoute && authToken ? getApiUrlString(apiCallRoute, query) : undefined,
    () => (load && category && authToken ? call<C>(apiCallFactory, query) : undefined)
  );

  return {
    data: (data as unknown as C['response'])?.body?.data as unknown as T['data'][],
    meta: (data as unknown as C['response'])?.body?.meta as {
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

export const useMutateList = (
  category: Category,
  additionalFilters?: [string, string][]
): (() => void) => {
  const {
    getCurrentPage: getPage,
    getEntriesPerPage: getSize,
    getFilters,
    getSortKey,
    getOrder,
  } = useContext(EntryListContext);
  const apiCallRoute = category?.api.list.route;
  const query =
    getPage && getSize
      ? makeListQuery(
          getPage(category.name),
          getSize(category.name),
          additionalFilters
            ? [...Object.entries(getFilters(category.name)), ...additionalFilters]
            : Object.entries(getFilters(category.name)),
          { key: getSortKey(category.name), order: getOrder(category.name) }
        )
      : undefined;

  return () => mutateSwr(getApiUrlString(apiCallRoute, query));
};

export const useEntry = <T extends CategoryEntry, C extends ApiCall>(
  category: Category,
  query: ParsedUrlQuery,
  load = true
): {
  entry: T & { error?: Error };
  mutate: (entry?: T, shouldRevalidate?: boolean) => Promise<C['response'] | undefined>;
} => {
  const call = useApiCall();
  const router = useRouter();
  const apiCallFactory = category?.api.show.factory;
  const apiCallRoute = category?.api.show.route;
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const activeRoute = useActiveRoute();
  const authToken = useAuthToken();

  const dataFromApi = useSWR<C['response']>(
    load &&
      apiCallRoute &&
      query &&
      authToken &&
      (query.id || (query.organizer && query.organizer !== defaultOrganizerId))
      ? getApiUrlString(apiCallRoute, query)
      : undefined,
    () => (authToken && load && apiCallRoute && query ? call(apiCallFactory, query) : undefined)
  );

  const { data, mutate, error } = dataFromApi;

  const wrappedMutate = (entry?: T, shouldRevalidate?: boolean) =>
    mutate(
      entry ? ({ status: 200, body: { data: entry } } as unknown as C['response']) : undefined,
      shouldRevalidate
    );

  const entry = useMemo(() => {
    if ((data?.body as unknown as T)?.data?.id) {
      return data?.body as unknown as T;
    }

    if (error && activeRoute !== Routes.page404) {
      if (category?.name !== Categories.organizer) {
        console.log('redirect to list because category error');
        router.replace(category?.routes.list({ locale, query: { organizer: organizerId } }));
      } else if (query?.organizer === organizerId) {
        return { error: new Error('no organizer defined') };
      } else {
        console.log('redirect to dashboard because category error');
        router.replace(
          routes.dashboard({
            locale,
          })
        );
      }
    }

    return undefined;
  }, [
    data?.body,
    error,
    activeRoute,
    query,
    category?.name,
    category?.routes,
    organizerId,
    router,
    locale,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { entry: entry as unknown as T, mutate: wrappedMutate };
};

export const useTabs = (category: Category): React.ReactElement<TabsProps> => {
  const router = useRouter();
  const locale = useLocale();

  const tabLinks = category?.tabs.map(({ title, sub }) => {
    const href = `${category?.routes.list({ locale, query: { ...router.query, sub } })}`;

    return {
      title,
      href,
      isActive: router.asPath.split('#')[0] === href,
    };
  });

  if (tabLinks?.length > 0) {
    return <Tabs links={tabLinks} />;
  }

  return null;
};

export const useEntryTypeList = <T extends ApiCall, C extends EntryType>(
  route: ApiRoutes,
  factory: ApiCallFactory
): C[] => {
  const call = useApiCall();

  const { data } = useSWR(getApiUrlString(route, undefined), () => call<T>(factory, undefined), {
    revalidateOnFocus: false,
    focusThrottleInterval: 1000 * 60 * 5,
  });

  return data?.body?.data as unknown as C[];
};

export const useOrganizerTypeList = (): OrganizerType[] => {
  const data = useEntryTypeList<OrganizerTypeList, OrganizerType>(
    ApiRoutes.organizerTypeList,
    organizerTypeListFactory
  );

  const language = useLanguage();

  return data ? sortByTranslation(data, language) : undefined;
};

export const useOfferTypeList = (): OfferType[] => {
  const data = useEntryTypeList<OfferTypeList, OfferType>(
    ApiRoutes.offerTypeList,
    offerTypeListFactory
  );

  const language = useLanguage();

  return data ? sortByTranslation(data, language) : undefined;
};

export const useOfferMainTypeList = (): OfferMainType[] => {
  const data = useEntryTypeList<OfferMainTypeList, OfferMainType>(
    ApiRoutes.offerMainTypeList,
    offerMainTypeListFactory
  );

  const language = useLanguage();

  return data ? sortByTranslation(data, language) : undefined;
};

export const useMediaLicenseList = (): MediaLicense[] => {
  const call = useApiCall();

  const { data } = useSWR(
    getApiUrlString(ApiRoutes.mediaLicenseList),
    () => call<MediaLicenseList>(mediaLicenseListFactory),
    {
      revalidateOnFocus: false,
      focusThrottleInterval: 1000 * 60 * 5,
    }
  );

  return data?.body?.data;
};

export const useDistrictList = (): District[] => {
  const call = useApiCall();

  const { data } = useSWR(
    getApiUrlString(ApiRoutes.districtList),
    () => call<DistrictList>(districtListFactory),
    {
      revalidateOnFocus: false,
      focusThrottleInterval: 1000 * 60 * 5,
    }
  );

  return data?.body?.data;
};

export const useCreateEntry = (
  categoryName: Categories
): (() => Promise<{
  success: boolean;
  error?: React.ReactNode | string;
}>) => {
  const call = useApiCall();
  const categories = useCategories();
  const organizerId = useOrganizerId();
  const setOrganizerId = useSetOrganizerId();
  const router = useRouter();
  const locale = useLocale();
  const t = useT();
  const { mutateUserInfo } = useUser();
  const { setLastEntryId } = useContext(EntryListContext);

  const category = categories ? categories[categoryName] : undefined;
  const mutateList = useMutateList(
    category,
    categoryName === Categories.location
      ? [['organizer', organizerId]]
      : categoryName === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );

  const entry = useMemo(
    () =>
      categoryName === Categories.organizer
        ? {}
        : categoryName === Categories.offer
        ? {
            relations: {
              organizers: [organizerId],
            },
          }
        : {
            attributes: {
              type: LocationType.physical,
            },
            relations: {
              organizer: organizerId,
            },
          },
    [categoryName, organizerId]
  );

  const createEntry = useCallback(async () => {
    try {
      const resp = await call<
        {
          response: {
            body: {
              data: {
                id: string;
              };
            } & ApiCall['response']['body'];
          } & ApiCall['response'];
        } & ApiCall
      >(category.api.create.factory, {
        entry,
      });

      if (resp.status === 200) {
        const id = resp.body.data.id;

        if (categoryName === Categories.organizer) {
          mutateUserInfo();
          setTimeout(() => setOrganizerId(id), 500);
        } else {
          mutateList();
          setLastEntryId(categoryName, id);
        }

        setTimeout(() => {
          router.push(
            routes.dashboard({
              locale,
              query: {
                organizerId,
              },
            })
          );

          setTimeout(() => {
            router.push(
              category.routes.list({
                locale,
                query: {
                  id,
                  sub: 'info',
                  organizer: categoryName === Categories.organizer ? id : organizerId,
                },
              })
            );
          }, 250);
        }, 150);

        return { success: true };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: t('general.serverProblem') };
    }
  }, [
    call,
    category?.api?.create?.factory,
    category?.routes,
    locale,
    mutateList,
    organizerId,
    entry,
    router,
    t,
    categoryName,
    setOrganizerId,
    mutateUserInfo,
    setLastEntryId,
  ]);

  return createEntry;
};

export const useCreateOrganizer = (): (() => Promise<{
  success: boolean;
  error?: React.ReactNode | string;
}>) => useCreateEntry(Categories.organizer);

export const useCreateOffer = (): (() => Promise<{
  success: boolean;
  error?: React.ReactNode | string;
}>) => useCreateEntry(Categories.offer);

export const useCreateLocation = (): (() => Promise<{
  success: boolean;
  error?: React.ReactNode | string;
}>) => useCreateEntry(Categories.location);

export const useDeleteEntry = (
  categoryName: Categories
): ((id: string) => Promise<{
  success: boolean;
  error?: React.ReactNode | string;
}>) => {
  const t = useT();
  const call = useApiCall();
  const categories = useCategories();
  const category = categories ? categories[categoryName] : undefined;
  const router = useRouter();
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const setOrganizerId = useSetOrganizerId();
  const { mutateUserInfo } = useUser();
  const { setLastEntryId } = useContext(EntryListContext);
  const { all: organizerOwnerList, contributor: organizerContributorList } =
    useUserOrganizerLists();

  const mutateList = useMutateList(
    category,
    categoryName === Categories.location
      ? [['organizer', organizerId]]
      : categoryName === Categories.offer
      ? [['organizers', organizerId]]
      : undefined
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const resp = await call(category.api.delete.factory, {
          id,
          entry: {
            attributes: { id },
          },
        });

        if (resp.status === 200) {
          setTimeout(() => {
            if (categoryName === Categories.organizer) {
              mutateUserInfo();

              const newActiveOrganizerId =
                [...organizerOwnerList, ...organizerContributorList].filter(
                  (organizer) => organizer.id !== id
                )[0]?.id || defaultOrganizerId;

              setOrganizerId(newActiveOrganizerId);

              router.push(routes.dashboard({ locale, query: { organizer: newActiveOrganizerId } }));
            } else {
              setLastEntryId(categoryName, undefined);
              mutateList();
              setTimeout(() => {
                router.push(
                  category.routes.list({
                    locale,
                    query: {
                      organizer: organizerId,
                    },
                  })
                );
              }, 250);
            }
          }, 250);

          return { success: true };
        }
      } catch (e) {
        console.error(e);

        return {
          success: false,
          error: t('general.serverProblem'),
        };
      }
    },
    [
      call,
      category?.api?.delete?.factory,
      category?.routes,
      categoryName,
      locale,
      mutateList,
      mutateUserInfo,
      organizerId,
      router,
      setOrganizerId,
      t,
      setLastEntryId,
      organizerContributorList,
      organizerOwnerList,
    ]
  );

  return deleteEntry;
};
