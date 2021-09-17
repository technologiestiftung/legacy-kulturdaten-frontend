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
import { LocationMediaPage } from '../components/pages/location/media';
import { offerListFactory } from '../lib/api/routes/offer/list';
import { offerShowFactory } from '../lib/api/routes/offer/show';
import { offerCreateFactory } from '../lib/api/routes/offer/create';
import { offerUpdateFactory } from '../lib/api/routes/offer/update';
import { offerTranslationCreateFactory } from '../lib/api/routes/offer/translation/create';
import { offerDeleteFactory } from '../lib/api/routes/offer/delete';
import { OfferInfoPage } from '../components/pages/offer/info';
import { OfferMediaPage } from '../components/pages/offer/media';
import { LocationCreatePage } from '../components/pages/location/create';
import { OfferCreatePage } from '../components/pages/offer/create';
import { OrganizerListPage } from '../components/pages/organizer/list';
import { OfferListPage } from '../components/pages/offer/list';
import { LocationListPage } from '../components/pages/location/list';
import { OfferCategorizationPage } from '../components/pages/offer/categorization';
import { OfferAccessibilityPage } from '../components/pages/offer/accessibility';
import { OfferDatesPage } from '../components/pages/offer/dates';
import { organizerMediaFactory } from '../lib/api/routes/organizer/media';

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
        list: OrganizerListPage,
      },
      tabs: [
        { title: t('categories.organizer.tabs.info') as string, sub: 'info' },
        { title: t('categories.organizer.tabs.categorization') as string, sub: 'categorization' },
        { title: t('categories.organizer.tabs.media') as string, sub: 'media' },
      ],
      metaLinks: [{ title: t('general.options') as string, icon: 'Settings' }],
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
          route: ApiRoutes.organizerTranslationCreate,
          factory: organizerTranslationCreateFactory,
        },
        delete: {
          route: ApiRoutes.organizerDelete,
          factory: organizerDeleteFactory,
        },
        media: {
          route: ApiRoutes.organizerUpdate,
          factory: organizerMediaFactory,
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
    offer: {
      name: Categories.offer,
      title: {
        singular: t('categories.offer.title.singular') as string,
        plural: t('categories.offer.title.plural') as string,
      },
      icon: MenuIconName.offer,
      routes: {
        list: routes[Routes.offer],
        create: routes[Routes.createOffer],
      },
      subMenuKey: 'offer',
      pages: {
        create: OfferCreatePage,
        info: OfferInfoPage,
        media: OfferMediaPage,
        categorization: OfferCategorizationPage,
        accessibility: OfferAccessibilityPage,
        list: OfferListPage,
        dates: OfferDatesPage,
      },
      tabs: [
        { title: t('categories.offer.tabs.info') as string, sub: 'info' },
        { title: t('categories.offer.tabs.categorization') as string, sub: 'categorization' },
        { title: t('categories.offer.tabs.dates') as string, sub: 'dates' },
        { title: t('categories.offer.tabs.accessibility') as string, sub: 'accessibility' },
        { title: t('categories.offer.tabs.media') as string, sub: 'media' },
      ],
      metaLinks: [{ title: t('general.options') as string, icon: 'Settings' }],
      api: {
        list: {
          route: ApiRoutes.offerList,
          factory: offerListFactory,
        },
        show: {
          route: ApiRoutes.offerShow,
          factory: offerShowFactory,
        },
        create: {
          route: ApiRoutes.offerCreate,
          factory: offerCreateFactory,
        },
        update: {
          route: ApiRoutes.offerUpdate,
          factory: offerUpdateFactory,
        },
        translationCreate: {
          route: ApiRoutes.offerTranslationCreate,
          factory: offerTranslationCreateFactory,
        },
        delete: {
          route: ApiRoutes.offerDelete,
          factory: offerDeleteFactory,
        },
      },
    },
    location: {
      name: Categories.location,
      title: {
        singular: t('categories.location.title.singular') as string,
        plural: t('categories.location.title.plural') as string,
      },
      icon: MenuIconName.location,
      routes: {
        list: routes[Routes.location],
        create: routes[Routes.createLocation],
      },
      subMenuKey: 'location',
      pages: {
        create: LocationCreatePage,
        info: LocationInfoPage,
        media: LocationMediaPage,
        list: LocationListPage,
      },
      tabs: [
        { title: t('categories.organizer.tabs.info') as string, sub: 'info' },
        { title: t('categories.organizer.tabs.media') as string, sub: 'media' },
      ],
      metaLinks: [{ title: t('general.options') as string, icon: 'Settings' }],
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
          route: ApiRoutes.locationTranslationCreate,
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
