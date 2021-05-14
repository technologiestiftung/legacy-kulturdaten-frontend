import { ApiRoutes, organizerListFactory } from '../lib/api';
import { organizerShowFactory } from '../lib/api/routes/organizer/show';
import { organizerCreateFactory } from '../lib/api/routes/organizer/create';
import { useT } from '../lib/i18n';
import { organizerUpdateFactory } from '../lib/api/routes/organizer/update';
import { organizerDeleteFactory } from '../lib/api/routes/organizer/delete';
import { Routes, routes } from '../lib/routing';
import { Category } from '../lib/categories';
import { OrganizerListPage } from '../components/pages/organizer/list';
import { OrganizerCreatePage } from '../components/pages/organizer/create';
import { OrganizerInfoPage } from '../components/pages/organizer/info';
import { OrganizerShowPage } from '../components/pages/organizer/show';
import { OrganizerRightsPage } from '../components/pages/organizer/rights';
import { OrganizerExportPage } from '../components/pages/organizer/export';

export enum Categories {
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
}

export const useCategories: () => {
  [key in Categories]: Category;
} = () => {
  const t = useT();

  return {
    organizer: {
      title: {
        singular: t('categories.organizer.title.singular') as string,
        plural: t('categories.organizer.title.plural') as string,
      },
      routes: {
        list: routes[Routes.organizer],
        create: routes[Routes.createOrganizer],
      },
      pages: {
        list: OrganizerListPage,
        create: OrganizerCreatePage,
        show: OrganizerShowPage,
        info: OrganizerInfoPage,
        rights: OrganizerRightsPage,
        export: OrganizerExportPage,
      },
      tabs: [
        { title: t('categories.organizer.tabs.overview') as string },
        { title: t('categories.organizer.tabs.info') as string, sub: 'info' },
        { title: t('categories.organizer.tabs.rights') as string, sub: 'rights' },
        { title: t('categories.organizer.tabs.export') as string, sub: 'export' },
      ],
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
