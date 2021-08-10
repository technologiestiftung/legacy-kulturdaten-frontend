import React, { Dispatch, ReactNode, Reducer, useReducer, useState } from 'react';
import { Order } from '../../lib/categories';

export enum FiltersActions {
  init = 'init',
  set = 'set',
}

type FiltersState = { [key: string]: string };

type FiltersAction = {
  type: FiltersActions;
  listName?: string;
  payload?: {
    state?: FiltersState;
    key?: string;
    value?: string;
  };
};

const filtersReducer: Reducer<{ [key: string]: FiltersState }, FiltersAction> = (state, action) => {
  switch (action.type) {
    case FiltersActions.init: {
      return { ...state, [action.listName]: action.payload.state };
    }

    case FiltersActions.set: {
      return {
        ...state,
        [action.listName]: {
          ...state[action.listName],
          [action.payload.key]: action.payload.value,
        },
      };
    }

    default: {
      break;
    }
  }
};

export enum EntryListView {
  table = 'table',
  cards = 'cards',
}

type EntryListContext = {
  getCurrentPage: (listName: string) => number;
  setCurrentPage: (listName: string, currentPage: number) => void;
  getEntriesPerPage: (listName: string) => number;
  setEntriesPerPage: (listName: string, entriesPerPage: number) => void;
  getOrder: (listName: string) => Order;
  setOrder: (listName: string, order: Order) => void;
  getSortKey: (listName: string) => string;
  setSortKey: (listName: string, sortKey: string) => void;
  getFilters: (listName: string) => FiltersState;
  getDispatchFilters: (listName: string) => Dispatch<FiltersAction>;
  getView: (listName: string) => EntryListView;
  setView: (listName: string, view: EntryListView) => void;
  getFiltersBoxExpanded: (listName: string) => boolean;
  setFiltersBoxExpanded: (listName: string, filtersBoxExpanded: boolean) => void;
  getLastEntryId: (listName: string) => string;
  setLastEntryId: (listName: string, id: string) => void;
};

export const EntryListContext = React.createContext<EntryListContext>({
  getCurrentPage: undefined,
  setCurrentPage: undefined,
  getEntriesPerPage: undefined,
  setEntriesPerPage: undefined,
  getOrder: undefined,
  setOrder: undefined,
  getSortKey: undefined,
  setSortKey: undefined,
  getFilters: undefined,
  getDispatchFilters: undefined,
  getView: undefined,
  setView: undefined,
  getFiltersBoxExpanded: undefined,
  setFiltersBoxExpanded: undefined,
  getLastEntryId: undefined,
  setLastEntryId: undefined,
});

interface EntryListContextProviderProps {
  children: ReactNode;
  listNames: string[];
}

export const EntryListContextProvider: React.FC<EntryListContextProviderProps> = ({
  children,
  listNames,
}: EntryListContextProviderProps) => {
  const [filters, dispatchFilters] = useReducer(
    filtersReducer,
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: {} }), {})
  );

  const [lastEntryIds, setLastEntryIds] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: undefined }), {})
  );

  const [currentPages, setCurrentPages] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: 1 }), {})
  );

  const [entriesPerPages, setEntriesPerPages] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: 8 }), {})
  );

  const [sortKeys, setSortKeys] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: 'updatedAt' }), {})
  );

  const [orders, setOrders] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: Order.DESC }), {})
  );

  const [views, setViews] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: EntryListView.cards }), {})
  );

  const [filtersBoxExpandeds, setFiltersBoxExpandeds] = useState(
    listNames.reduce((pages, listName) => ({ ...pages, [listName]: true }), {})
  );

  return (
    <EntryListContext.Provider
      value={{
        getCurrentPage: (listName) => currentPages[listName],
        setCurrentPage: (listName, currentPage) =>
          setCurrentPages({ ...currentPages, [listName]: currentPage }),
        getEntriesPerPage: (listName) => entriesPerPages[listName],
        setEntriesPerPage: (listName, entriesPerPage) =>
          setEntriesPerPages({ ...entriesPerPages, [listName]: entriesPerPage }),
        getOrder: (listName) => orders[listName],
        setOrder: (listName, order) => setOrders({ ...orders, [listName]: order }),
        getSortKey: (listName) => sortKeys[listName],
        setSortKey: (listName, sortKey) => setSortKeys({ ...sortKeys, [listName]: sortKey }),
        getLastEntryId: (listName) => lastEntryIds[listName],
        setLastEntryId: (listName, id) => setLastEntryIds({ ...lastEntryIds, [listName]: id }),
        getFilters: (listName) => filters[listName],
        getDispatchFilters: (listName) => (action) => dispatchFilters({ ...action, listName }),
        getView: (listName) => views[listName],
        setView: (listName, view) => setViews({ ...views, [listName]: view }),
        getFiltersBoxExpanded: (listName) => filtersBoxExpandeds[listName],
        setFiltersBoxExpanded: (listName, filtersBoxExpanded) =>
          setFiltersBoxExpandeds({ ...filtersBoxExpandeds, [listName]: filtersBoxExpanded }),
      }}
    >
      {children}
    </EntryListContext.Provider>
  );
};
