import { ApiRoutes, locationListFactory, organizerListFactory } from '../lib/api';
import { organizerShowFactory } from '../lib/api/routes/organizer/show';
import { organizerCreateFactory } from '../lib/api/routes/organizer/create';
import { useT } from '../lib/i18n';
import { organizerUpdateFactory } from '../lib/api/routes/organizer/update';
import { organizerDeleteFactory } from '../lib/api/routes/organizer/delete';
import { Routes, routes } from '../lib/routing';
import { Category } from '../lib/categories';
import { OrganizerCreatePage } from '../components/pages/organizer/create';
import { OrganizerInfoPage } from '../components/pages/organizer/info';
import { OrganizerMediaPage } from '../components/pages/organizer/media';
import { OrganizerCategorizationPage } from '../components/pages/organizer/categorization';
import { OrganizerPreviewPage } from '../components/pages/organizer/preview';
import { OrganizerRightsPage } from '../components/pages/organizer/rights';
import { OrganizerExportPage } from '../components/pages/organizer/export';
import { MenuIconName } from '../components/navigation/Menu/MenuIcon';
import { organizerTranslationCreateFactory } from '../lib/api/routes/organizer/translation/create';
import { LocationInfoPage } from '../components/pages/location/info';
import { locationCreateFactory } from '../lib/api/routes/location/create';
import { locationUpdateFactory } from '../lib/api/routes/location/update';
import { locationTranslationCreateFactory } from '../lib/api/routes/location/translation/create';
import { locationDeleteFactory } from '../lib/api/routes/location/delete';
import { locationShowFactory } from '../lib/api/routes/location/show';

export type Requirement = {
  translationKey: string;
  publishableKeys: string[];
};

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
      subMenuKey: 'organizer',
      pages: {
        create: OrganizerCreatePage,
        preview: OrganizerPreviewPage,
        info: OrganizerInfoPage,
        categorization: OrganizerCategorizationPage,
        media: OrganizerMediaPage,
        rights: OrganizerRightsPage,
        export: OrganizerExportPage,
      },
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
          factory: organizerTranslationCreateFactory,
        },
        delete: {
          route: ApiRoutes.organizerDelete,
          factory: organizerDeleteFactory,
        },
      },
      requirements: [
        {
          translationKey: 'categories.organizer.requirements.name',
          publishableKeys: ['attributes.name'],
        },
        {
          translationKey: 'categories.organizer.requirements.address',
          publishableKeys: [
            'relations.address',
            'relations.address.attributes.city',
            'relations.address.attributes.street1',
            'relations.address.attributes.street2',
            'relations.address.attributes.zipCode',
          ],
        },
        {
          translationKey: 'categories.organizer.requirements.description',
          publishableKeys: ['attributes.description'],
        },
        {
          translationKey: 'categories.organizer.requirements.categorization',
          publishableKeys: ['relations.types', 'relations.subjects'],
        },
      ],
    },
    offer: undefined,
    location: {
      name: Categories.location,
      title: {
        singular: t('categories.organizer.title.singular') as string,
        plural: t('categories.organizer.title.plural') as string,
      },
      icon: MenuIconName.organizer,
      routes: {
        list: routes[Routes.location],
        create: routes[Routes.createLocation],
      },
      subMenuKey: 'location',
      pages: {
        create: OrganizerCreatePage,
        preview: OrganizerPreviewPage,
        info: LocationInfoPage,
        categorization: OrganizerCategorizationPage,
        media: OrganizerMediaPage,
        rights: OrganizerRightsPage,
        export: OrganizerExportPage,
      },
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
          route: ApiRoutes.locationList,
          factory: locationListFactory,
        },
        show: {
          route: ApiRoutes.locationShow,
          factory: locationShowFactory,
        },
        create: {
          route: ApiRoutes.locationCreate,
          factory: locationCreateFactory,
        },
        update: {
          route: ApiRoutes.locationUpdate,
          factory: locationUpdateFactory,
        },
        translationCreate: {
          route: ApiRoutes.LocationTranslationCreate,
          factory: locationTranslationCreateFactory,
        },
        delete: {
          route: ApiRoutes.locationDelete,
          factory: locationDeleteFactory,
        },
      },
    },
  };
};
