import { ApiCallFactory, ApiRoutes, organizerListFactory } from '../lib/api';
import { organizerShowFactory } from '../lib/api/routes/organizer/show';
import { organizerCreateFactory } from '../lib/api/routes/organizer/create';
import { useT } from '../lib/i18n';
import { organizerUpdateFactory } from '../lib/api/routes/organizer/update';
import { organizerDeleteFactory } from '../lib/api/routes/organizer/delete';

export enum Categories {
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
}

type categoryApi = {
  route: ApiRoutes;
  factory: ApiCallFactory;
};

export const useCategories: () => {
  [key in Categories]: {
    title: {
      singular: string;
      plural: string;
    };
    api: {
      list: categoryApi;
      show: categoryApi;
      create: categoryApi;
      update: categoryApi;
      delete: categoryApi;
    };
  };
} = () => {
  const t = useT();

  return {
    organizer: {
      title: {
        singular: t('categories.organizer.title.singular') as string,
        plural: t('categories.organizer.title.plural') as string,
      },
      api: {
        list: {
          route: ApiRoutes.organizerList,
          factory: organizerListFactory,
        },
        show: {
          route: ApiRoutes.organizerShow,
          factory: organizerShowFactory,
        },
        create: {
          route: ApiRoutes.organizerCreate,
          factory: organizerCreateFactory,
        },
        update: {
          route: ApiRoutes.organizerUpdate,
          factory: organizerUpdateFactory,
        },
        delete: {
          route: ApiRoutes.organizerDelete,
          factory: organizerDeleteFactory,
        },
      },
    },
    offer: undefined,
    location: undefined,
  };
};
