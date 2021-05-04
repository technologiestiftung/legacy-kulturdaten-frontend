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
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
}

export const mockCategories: {
  [key in Categories]: Category;
} = {
  organizer: {
    name: {
      singular: 'Organizer',
      plural: 'Organizers',
    },
    list: {
      route: routes.organizers,
      data: () => [],
    },
    entry: {
      route: routes.organizer,
      data: () => ({}),
    },
  },
  offer: null,
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
