import { apiRoutes, ApiRoutes, locationListFactory, organizerListFactory } from '../lib/api';
import { organizerShowFactory } from '../lib/api/routes/organizer/show';
import { organizerCreateFactory } from '../lib/api/routes/organizer/create';
import { useT } from '../lib/i18n';
import { organizerUpdateFactory } from '../lib/api/routes/organizer/update';
import { organizerDeleteFactory } from '../lib/api/routes/organizer/delete';
import { Routes, routes, useLocale } from '../lib/routing';
import { Category, CategoryExportType } from '../lib/categories';
import { OrganizerInfoPage } from '../components/pages/organizer/info';
import { OrganizerCategorizationPage } from '../components/pages/organizer/categorization';
import { MenuIconName } from '../components/navigation/Menu/MenuIcon';
import { LocationInfoPage } from '../components/pages/location/info';
import { locationCreateFactory } from '../lib/api/routes/location/create';
import { locationUpdateFactory } from '../lib/api/routes/location/update';
import { locationDeleteFactory } from '../lib/api/routes/location/delete';
import { locationShowFactory } from '../lib/api/routes/location/show';
import { offerListFactory } from '../lib/api/routes/offer/list';
import { offerShowFactory } from '../lib/api/routes/offer/show';
import { offerCreateFactory } from '../lib/api/routes/offer/create';
import { offerUpdateFactory } from '../lib/api/routes/offer/update';
import { offerDeleteFactory } from '../lib/api/routes/offer/delete';
import { OfferInfoPage } from '../components/pages/offer/info';
import { OrganizerListPage } from '../components/pages/organizer/list';
import { OfferListPage } from '../components/pages/offer/list';
import { LocationListPage } from '../components/pages/location/list';
import { OfferCategorizationPage } from '../components/pages/offer/categorization';
import { OfferAudiencePage } from '../components/pages/offer/audience';
import { OfferDatesPage } from '../components/pages/offer/dates';
import { organizerMediaFactory } from '../lib/api/routes/organizer/media';
import { OrganizerMediaPage } from '../components/pages/organizer/media';
import { OfferMediaPage } from '../components/pages/offer/media';
import { LocationMediaPage } from '../components/pages/location/media';
import { LocationAccessibilityPage } from '../components/pages/location/accessibility';
import { LocationServicePage } from '../components/pages/location/service';
import { organizerTypeListFactory } from '../lib/api/routes/organizerType/list';
import { offerTypeListFactory } from '../lib/api/routes/offerType/list';
import { defaultLanguage, Language } from './locale';
import { ParsedUrlQuery } from 'querystring';
import { Page404 } from '../components/pages/404';
import { createRef, LegacyRef, Ref } from 'react'

type RequirementAttributes = {
  path: string;
  translation?: {
    language: Language;
    attribute: string;
  };
};

export type Requirement = {
  key: string;
  translation: string | React.ReactNode;
  publishableKeys: string[];
  attributes: RequirementAttributes[];
  link: {
    targetId: string;
    href: (query: ParsedUrlQuery) => string;
    ariaLabel: string;
    targetRef?: any;
  };
};

export type RequirementFulfillment = {
  requirementKey: string;
  fulfilled: boolean;
};

export enum Categories {
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
}

export enum CategoriesPlural {
  organizers = 'organizers',
  offers = 'offers',
  locations = 'locations',
}

export const organizerInternalContactRef: Ref<HTMLInputElement> = createRef();
export const organizerNameRef: LegacyRef<HTMLLegendElement> = createRef();
export const organizerDescriptionRef: LegacyRef<HTMLLegendElement> = createRef();
export const organizerTypeRef: LegacyRef<HTMLLegendElement> = createRef();

export const offerCategoryRef = createRef();
export const offerNameRef = createRef();
export const offerDescriptionRef = createRef();
export const offerTypeRef = createRef();

export const locationNameRef = createRef();
export const locationDescriptionRef = createRef();

export const mainTitleLink = createRef();
export const sidebarRef = createRef();

export const useCategories: () => {
  [key in Categories]: Category;
} = () => {
  const t = useT();
  const locale = useLocale();

  return {
    organizer: {
      placeholderName: t('general.placeholderOrganizer') as string,
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
        'info': OrganizerInfoPage,
        'categorization': OrganizerCategorizationPage,
        'media': OrganizerMediaPage,
        'list': OrganizerListPage,
        '404': Page404,
      },
      tabs: [
        { title: t('categories.organizer.tabs.info') as string, sub: 'info' },
        { title: t('categories.organizer.tabs.categorization') as string, sub: 'categorization' },
        { title: t('categories.organizer.tabs.media') as string, sub: 'media' },
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
        typeList: {
          route: ApiRoutes.organizerTypeList,
          factory: organizerTypeListFactory,
        },
        media: {
          route: ApiRoutes.organizerUpdate,
          factory: organizerMediaFactory,
        },
      },
      options: {
        export: [
          {
            format: 'xls',
            title: t('categories.organizer.options.exportEntryXls') as string,
            route: apiRoutes.organizerDownload,
            type: CategoryExportType.entry,
          },
          {
            format: 'xls',
            title: t('categories.organizer.options.exportListXls') as string,
            route: apiRoutes.organizerListDownload,
            type: CategoryExportType.list,
          },
        ],
        deletion: {
          title: t('categories.organizer.options.delete') as string,
          message: (name) => t('categories.organizer.options.deleteConfirm', { name }) as string,
          deleting: t('categories.organizer.options.deleting') as string,
          button: t('general.confirmDelete') as string,
          condition: {
            label: 'Name der Anbieter:in',
            error: 'nicht korrekt',
          },
        },
      },
      publishText: t('categories.organizer.publishText') as string,
      requirements: [
        {
          key: 'name',
          translation: t('categories.organizer.requirements.name'),
          publishableKeys: ['attributes.name'],
          attributes: [
            {
              path: 'relations.translations',
              translation: {
                language: defaultLanguage,
                attribute: 'name',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.organizer({ locale, query: { ...query, sub: 'info' } })}#organizer-name`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.organizer.requirements.name') as string,
            }) as string,
            targetId: '#organizer-name',
            targetRef: organizerNameRef
          },
        },
        {
          key: 'mainContact',
          translation: t('categories.organizer.requirements.mainContact'),
          publishableKeys: ['relations.mainContact'],
          attributes: [
            {
              path: 'relations.mainContact.relations.translation',
              translation: {
                language: defaultLanguage,
                attribute: 'name',
              },
            },
            {
              path: 'relations.mainContact.attributes.email',
            },
          ],
          link: {
            href: (query) =>
              `${routes.organizer({
                locale,
                query: { ...query, sub: 'info' },
              })}#organizer-internal-contact`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.organizer.requirements.mainContact') as string,
            }) as string,
            targetId: '#organizer-internal-contact',
            targetRef: organizerInternalContactRef
          },
        },
        {
          key: 'description',
          translation: t('categories.organizer.requirements.description'),
          publishableKeys: ['attributes.description'],
          attributes: [
            {
              path: 'relations.translation',
              translation: {
                language: defaultLanguage,
                attribute: 'description',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.organizer({
                locale,
                query: { ...query, sub: 'info' },
              })}#organizer-description`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.organizer.requirements.description') as string,
            }) as string,
            targetId: '#organizer-description',
            targetRef: organizerDescriptionRef
          },
        },
        {
          key: 'types',
          translation: t('categories.organizer.requirements.categorization'),
          publishableKeys: ['relations.types', 'relations.subjects'],
          attributes: [
            {
              path: 'relations.types',
            },
          ],
          link: {
            href: (query) =>
              `${routes.organizer({
                locale,
                query: { ...query, sub: 'categorization' },
              })}#organizer-types`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.organizer.requirements.categorization') as string,
            }) as string,
            targetId: '#organizer-types',
            targetRef: organizerTypeRef
          },
        },
      ],
    },
    offer: {
      placeholderName: t('general.placeholderOffer') as string,
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
        'info': OfferInfoPage,
        'media': OfferMediaPage,
        'categorization': OfferCategorizationPage,
        'audience': OfferAudiencePage,
        'list': OfferListPage,
        'dates': OfferDatesPage,
        '404': Page404,
      },
      tabs: [
        { title: t('categories.offer.tabs.info') as string, sub: 'info' },
        { title: t('categories.offer.tabs.categorization') as string, sub: 'categorization' },
        { title: t('categories.offer.tabs.dates') as string, sub: 'dates' },
        //{ title: t('categories.offer.tabs.accessibility') as string, sub: 'accessibility' },
        { title: t('categories.offer.tabs.audience') as string, sub: 'audience' },
        { title: t('categories.offer.tabs.media') as string, sub: 'media' },
      ],
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
        delete: {
          route: ApiRoutes.offerDelete,
          factory: offerDeleteFactory,
        },
        typeList: {
          route: ApiRoutes.offerTypeList,
          factory: offerTypeListFactory,
        },
      },
      options: {
        export: [
          {
            format: 'xls',
            title: t('categories.offer.options.exportEntryXls') as string,
            route: apiRoutes.offerDownload,
            type: CategoryExportType.entry,
          },
          {
            format: 'xls',
            title: t('categories.offer.options.exportDatesXls') as string,
            route: apiRoutes.offerDateListDownload,
            type: CategoryExportType.entry,
            fileNameFactory: (offerName) =>
              t('categories.offer.options.exportDatesFileName', { offerName }) as string,
          },
          {
            format: 'xls',
            title: t('categories.offer.options.exportListXls') as string,
            route: apiRoutes.offerListDownload,
            type: CategoryExportType.list,
          },
        ],
        deletion: {
          title: t('categories.offer.options.delete') as string,
          message: (name) => t('categories.offer.options.deleteConfirm', { name }) as string,
          deleting: t('categories.offer.options.deleting') as string,
          button: t('general.confirmDelete') as string,
        },
      },
      publishText: t('categories.offer.publishText') as string,
      requirements: [
        {
          key: 'name',
          translation: t('categories.offer.requirements.name'),
          publishableKeys: ['attributes.name'],
          attributes: [
            {
              path: 'relations.translations',
              translation: {
                language: defaultLanguage,
                attribute: 'name',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.offer({ locale, query: { ...query, sub: 'info' } })}#offer-name`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.offer.requirements.name') as string,
            }) as string,
            targetId: '#offer-name',
            targetRef: offerNameRef
          },
        },

        {
          key: 'description',
          translation: t('categories.offer.requirements.description'),
          publishableKeys: ['attributes.description'],
          attributes: [
            {
              path: 'relations.translations',
              translation: {
                language: defaultLanguage,
                attribute: 'description',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.offer({ locale, query: { ...query, sub: 'info' } })}#offer-description`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.offer.requirements.description') as string,
            }) as string,
            targetId: '#offer-description',
            targetRef: offerDescriptionRef
          },
        },
        {
          key: 'mainType',
          translation: t('categories.offer.requirements.mainType'),
          publishableKeys: ['relations.mainType'],
          attributes: [
            {
              path: 'relations.mainType',
            },
          ],
          link: {
            href: (query) =>
              `${routes.offer({
                locale,
                query: { ...query, sub: 'categorization' },
              })}#offer-main-type`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.offer.requirements.mainType') as string,
            }) as string,
            targetId: '#offer-main-type',
            targetRef: offerTypeRef
          },
        },
        {
          key: 'types',
          translation: t('categories.offer.requirements.categorization'),
          publishableKeys: ['relations.types'],
          attributes: [
            {
              path: 'relations.types',
            },
          ],
          link: {
            href: (query) =>
              `${routes.offer({ locale, query: { ...query, sub: 'categorization' } })}#offer-types`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.offer.requirements.categorization') as string,
            }) as string,
            targetId: '#offer-types',
            targetRef: offerCategoryRef
          },
        },
      ],
    },
    location: {
      placeholderName: t('general.placeholderLocation') as string,
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
        'info': LocationInfoPage,
        'service': LocationServicePage,
        'media': LocationMediaPage,
        'accessibility': LocationAccessibilityPage,
        'list': LocationListPage,
        '404': Page404,
      },
      tabs: [
        { title: t('categories.location.tabs.info') as string, sub: 'info' },
        { title: t('categories.location.tabs.service') as string, sub: 'service' },
        { title: t('categories.location.tabs.accessibility') as string, sub: 'accessibility' },
        { title: t('categories.location.tabs.media') as string, sub: 'media' },
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
        delete: {
          route: ApiRoutes.locationDelete,
          factory: locationDeleteFactory,
        },
      },
      options: {
        export: [
          {
            format: 'xls',
            title: t('categories.location.options.exportEntryXls') as string,
            route: apiRoutes.locationDownload,
            type: CategoryExportType.entry,
          },
          {
            format: 'xls',
            title: t('categories.location.options.exportListXls') as string,
            route: apiRoutes.locationListDownload,
            type: CategoryExportType.list,
          },
        ],
        deletion: {
          title: t('categories.location.options.delete') as string,
          message: (name) => t('categories.location.options.deleteConfirm', { name }) as string,
          deleting: t('categories.location.options.deleting') as string,
          button: t('general.confirmDelete') as string,
        },
      },
      publishText: t('categories.location.publishText') as string,
      requirements: [
        {
          key: 'name',
          translation: t('categories.location.requirements.name'),
          publishableKeys: ['attributes.name'],
          attributes: [
            {
              path: 'relations.translations',
              translation: {
                language: defaultLanguage,
                attribute: 'name',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.location({ locale, query: { ...query, sub: 'info' } })}#location-name`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.location.requirements.name') as string,
            }) as string,
            targetId: '#location-name',
            targetRef: locationNameRef
          },
        },
        {
          key: 'description',
          translation: t('categories.location.requirements.description'),
          publishableKeys: ['attributes.description'],
          attributes: [
            {
              path: 'relations.translations',
              translation: {
                language: defaultLanguage,
                attribute: 'description',
              },
            },
          ],
          link: {
            href: (query) =>
              `${routes.location({
                locale,
                query: { ...query, sub: 'info' },
              })}#location-description`,
            ariaLabel: t('requirements.nameLabel', {
              fieldName: t('categories.location.requirements.description') as string,
            }) as string,
            targetId: '#location-description',
            targetRef: locationDescriptionRef
          },
        },
      ],
    },
  };
};
