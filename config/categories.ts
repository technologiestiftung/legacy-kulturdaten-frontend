import { ApiRoutes, organizerListFactory } from '../lib/api';
import { organizerShowFactory } from '../lib/api/routes/organizer/show';
import { organizerCreateFactory } from '../lib/api/routes/organizer/create';
import { useT } from '../lib/i18n';
import { organizerUpdateFactory } from '../lib/api/routes/organizer/update';
import { organizerDeleteFactory } from '../lib/api/routes/organizer/delete';
import { Routes, routes } from '../lib/routing';
import { Category } from '../lib/categories';
import { OrganizerListPage, useOrganizerMenu } from '../components/pages/organizer/list';
import { OrganizerCreatePage } from '../components/pages/organizer/create';
import { OrganizerInfoPage } from '../components/pages/organizer/info';
import { OrganizerMediaPage } from '../components/pages/organizer/media';
import { OrganizerCategorizationPage } from '../components/pages/organizer/categorization';
import { OrganizerPreviewPage } from '../components/pages/organizer/preview';
import { OrganizerRightsPage } from '../components/pages/organizer/rights';
import { OrganizerExportPage } from '../components/pages/organizer/export';
import { MenuIconName } from '../components/navigation/mainMenu/MenuIcon';
import { OrganizerTranslationCreateFactory } from '../lib/api/routes/organizer/translation/create';

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
      name: Categories.organizer,
      title: {
        singular: t('categories.organizer.title.singular') as string,
        plural: t('categories.organizer.title.plural') as string,
      },
      icon: MenuIconName.organizer,
      routes: {
        list: routes[Routes.organizer],
        create: routes[Routes.createOrganizer],
      },
      pages: {
        list: OrganizerListPage,
        create: OrganizerCreatePage,
        preview: OrganizerPreviewPage,
        info: OrganizerInfoPage,
        categorization: OrganizerCategorizationPage,
        media: OrganizerMediaPage,
        rights: OrganizerRightsPage,
        export: OrganizerExportPage,
      },
      menuFactory: useOrganizerMenu,
      tabs: [
        { title: t('categories.organizer.tabs.info') as string, sub: 'info' },
        { title: t('categories.organizer.tabs.categorization') as string, sub: 'categorization' },
        { title: t('categories.organizer.tabs.media') as string, sub: 'media' },
        { title: t('categories.organizer.tabs.preview') as string, sub: 'preview' },
      ],
      metaLinks: [
        { title: t('categories.organizer.metaLinks.rights') as string, icon: 'Users' },
        { title: t('categories.organizer.metaLinks.export') as string, icon: 'Archive' },
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
        translationCreate: {
          route: ApiRoutes.OrganizerTranslationCreate,
          factory: OrganizerTranslationCreateFactory,
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
