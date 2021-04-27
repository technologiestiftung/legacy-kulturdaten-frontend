import { Route, routes } from '../lib/routing';

export interface Category {
  name: {
    singular: string;
    plural: string;
  };
  list: {
    route: Route;
    data: () => any;
  };
  entry: {
    route: Route;
    data: () => any;
  };
}

export enum Categories {
  provider = 'provider',
  offering = 'offering',
  location = 'location',
}

export const mockCategories: {
  [key in Categories]: Category;
} = {
  provider: {
    name: {
      singular: 'Provider',
      plural: 'Providers',
    },
    list: {
      route: routes.providers,
      data: () => [],
    },
    entry: {
      route: routes.provider,
      data: () => ({}),
    },
  },
  offering: null,
  location: null,
};

const mockNav = {
  start: {
    dashboard: null,
    messages: null,
  },
  user: {
    profile: null,
    settings: null,
  },
};
