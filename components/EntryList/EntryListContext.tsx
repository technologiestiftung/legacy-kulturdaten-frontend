import React, { Dispatch, ReactNode, Reducer, useReducer, useState } from 'react';
import { Order } from '../../lib/categories';

export enum FiltersActions {
  init = 'init',
  set = 'set',
}

type FiltersState = { [key: string]: string };

type FiltersAction = {
  type: FiltersActions;
  payload?: {
    state?: FiltersState;
    key?: string;
    value?: string;
  };
};

const filtersReducer: Reducer<FiltersState, FiltersAction> = (state, action) => {
  switch (action.type) {
    case FiltersActions.init: {
      return action.payload.state;
    }

    case FiltersActions.set: {
      return { ...state, [action.payload.key]: action.payload.value };
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
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  entriesPerPage: number;
  setEntriesPerPage: (entriesPerPage: number) => void;
  order: Order;
  setOrder: (order: Order) => void;
  sortKey: string;
  setSortKey: (sortKey: string) => void;
  filters: FiltersState;
  dispatchFilters: Dispatch<FiltersAction>;
  view: EntryListView;
  setView: (view: EntryListView) => void;
  filtersBoxExpanded: boolean;
  setFiltersBoxExpanded: (filtersBoxExpanded: boolean) => void;
};

export const EntryListContext = React.createContext<EntryListContext>({
  currentPage: undefined,
  setCurrentPage: () => undefined,
  entriesPerPage: undefined,
  setEntriesPerPage: () => undefined,
  order: undefined,
  setOrder: () => undefined,
  sortKey: undefined,
  setSortKey: () => undefined,
  filters: undefined,
  dispatchFilters: () => undefined,
  view: undefined,
  setView: () => undefined,
  filtersBoxExpanded: undefined,
  setFiltersBoxExpanded: () => undefined,
});

interface EntryListContextProviderProps {
  children: ReactNode;
}

export const EntryListContextProvider: React.FC<EntryListContextProviderProps> = ({
  children,
}: EntryListContextProviderProps) => {
  const [filters, dispatchFilters] = useReducer(filtersReducer, {});
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [sortKey, setSortKey] = useState('updatedAt');
  const [order, setOrder] = useState(Order.DESC);
  const [view, setView] = useState(EntryListView.cards);
  const [filtersBoxExpanded, setFiltersBoxExpanded] = useState(true);

  return (
    <EntryListContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        entriesPerPage,
        setEntriesPerPage,
        order,
        setOrder,
        sortKey,
        setSortKey,
        filters,
        dispatchFilters,
        view,
        setView,
        filtersBoxExpanded,
        setFiltersBoxExpanded,
      }}
    >
      {children}
    </EntryListContext.Provider>
  );
};
