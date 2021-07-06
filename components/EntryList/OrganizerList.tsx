import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import {
  PropsWithChildren,
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Plus } from 'react-feather';
import { StyledEntryListBody } from '.';
import { useCategories } from '../../config/categories';
import { OrganizerList as OrganizerListCall } from '../../lib/api';
import { Organizer, OrganizerTranslation } from '../../lib/api/types/organizer';
import { Order, useList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Routes, routes, useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { useCollapsable } from '../collapsable';
import { NavigationContext } from '../navigation/NavigationContext';
import { Select } from '../select';
import { EntryListHead } from './EntryListHead';
import { EntryListPagination } from './EntryListPagination';
import { EntryCard, EntryCardTypesSubjects } from './EntryCard';

enum FiltersActions {
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

interface OrganizerListProps {
  expanded: boolean;
}

const StyledFiltersBox = styled.div<{ expanded: boolean }>`
  ${({ expanded }) =>
    expanded
      ? css``
      : css`
          border: 1px solid var(--grey-400);
          border-radius: 0.75rem;
        `}
`;

const StyledFiltersBoxTitle = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  width: 100%;
  border-bottom: 1px solid var(--grey-400);
  padding: 0 0 0.375rem;
  margin: 0 0 0.75rem;
`;

const StyledFiltersBoxChildren = styled.div<{ expanded: boolean }>`
  ${({ expanded }) =>
    !expanded
      ? css`
          border-top: 1px solid var(--grey-400);
          padding: 0.75rem;
        `
      : ''}
`;

const StyledFiltersBoxTitleButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  appearance: none;
  width: 100%;
  background: none;
  border: none;
  padding: 0.375rem 0.75rem;
  margin: 0;
  text-align: left;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  cursor: pointer;
  color: var(--black);
  border-radius: ${({ isCollapsed }) => (isCollapsed ? '0.75rem' : '0.75rem 0.75rem 0 0')};

  > svg {
    display: block;
    width: 1.125rem;
    height: 1.125rem;
    transition: transform var(--transition-duration);
    transform: rotate(${({ isCollapsed }) => (isCollapsed ? '0deg' : '45deg')});
  }
`;

interface FiltersBoxProps {
  expanded: boolean;
  initiallyCollapsed?: boolean;
}

const FiltersBox: React.FC<PropsWithChildren<FiltersBoxProps>> = ({
  expanded,
  initiallyCollapsed = true,
  children,
}: PropsWithChildren<FiltersBoxProps>) => {
  const t = useT();

  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <StyledFiltersBoxChildren expanded={expanded}>{children}</StyledFiltersBoxChildren>,
    initiallyCollapsed
  );

  return (
    <StyledFiltersBox expanded={expanded}>
      {expanded ? (
        <>
          <StyledFiltersBoxTitle>{t('general.filter')}</StyledFiltersBoxTitle>
          <StyledFiltersBoxChildren expanded={expanded}>{children}</StyledFiltersBoxChildren>
        </>
      ) : (
        <>
          <StyledFiltersBoxTitleButton
            isCollapsed={isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {t('general.filter')}
            <Plus />
          </StyledFiltersBoxTitleButton>
          {renderedCollapsable}
        </>
      )}
    </StyledFiltersBox>
  );
};

const EntryListSort = styled.div`
  padding: 0 0.75rem;
`;

const EntryCardGrid = styled.div<{ expanded: boolean }>`
  display: grid;
  grid-template-columns: auto;
  grid-column-gap: 1.5rem;
  grid-row-gap: 0.75rem;
  padding: 1.5rem 0.75rem;

  ${({ expanded }) =>
    expanded
      ? css`
          grid-row-gap: 1.5rem;
          grid-template-columns: 1fr 1fr;
        `
      : ''}
`;

export const OrganizerList: React.FC<OrganizerListProps> = ({ expanded }: OrganizerListProps) => {
  const categories = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setNavigationOpen, setMenuExpanded } = useContext(NavigationContext);
  const [sortKey, setSortKey] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState(Order.DESC);

  const [filters, dispatchFilters] = useReducer(filtersReducer, {});

  const pseudoUID = usePseudoUID();

  const list = useList<OrganizerListCall, Organizer>(
    categories.organizer,
    currentPage,
    entriesPerPage,
    Object.entries(filters),
    { key: sortKey, order: sortOrder }
  );

  useEffect(() => {
    // Go to first page if filters, sorting or display type are changed
    setCurrentPage(1);
  }, [filters, sortKey, sortOrder, entriesPerPage]);

  useEffect(() => {
    const lastPageFromApi = list?.meta?.pages?.lastPage;

    if (lastPageFromApi) {
      setLastPage(lastPageFromApi);
    }
  }, [list?.meta?.pages?.lastPage]);

  useEffect(() => {
    const totalEntriesFromApi = list?.meta?.pages?.total;

    if (totalEntriesFromApi) {
      setTotalEntries(totalEntriesFromApi);
    }
  }, [list?.meta?.pages?.total]);

  const cards = useMemo(
    () =>
      list?.data
        ? Object.values(list.data).map(({ attributes, relations, id }, index) => {
            const href = (sub?: string) =>
              routes[Routes.organizer]({
                locale,
                query: { id, sub },
              });

            const { translations } = relations;
            const currentTranslation = getTranslation<OrganizerTranslation>(language, translations);
            const typeNames = relations?.types?.map((type) => {
              // const typeTranslation = getTranslation<OrganizerTypeTranslation>(
              //   language,
              //   type.relations.translations
              // );
              const typeTranslation = type.relations.translations[0];
              return typeTranslation?.attributes.name;
            });

            const subjectNames = relations?.subjects?.map((subject) => {
              // const subjectTranslation = getTranslation<OrganizerSubjectTranslation>(
              //   language,
              //   subject.relations.translations
              // );
              const subjectTranslation = subject.relations.translations[0];
              return subjectTranslation?.attributes.name;
            });

            return (
              <EntryCard
                onClick={() => {
                  setMenuExpanded(false);
                  setNavigationOpen(false);
                }}
                href={href('info')}
                menuExpanded={expanded}
                key={index}
                title={currentTranslation?.attributes?.name}
                status={attributes?.status}
                active={router.asPath.includes(href())}
                meta={<EntryCardTypesSubjects types={typeNames} subjects={subjectNames} />}
                createdDate={attributes?.createdAt ? new Date(attributes?.createdAt) : undefined}
                updatedDate={attributes?.updatedAt ? new Date(attributes?.updatedAt) : undefined}
              />
            );
          })
        : undefined,
    [expanded, language, list.data, locale, router.asPath, setMenuExpanded, setNavigationOpen]
  );

  return (
    <div>
      <EntryListHead
        title={t('categories.organizer.title.plural') as string}
        expanded={expanded}
        accentColor="var(--red)"
      >
        <FiltersBox expanded={expanded}>
          <Select
            label={t('categories.organizer.filters.status.label') as string}
            id={`entry-filter-${pseudoUID}`}
            value={filters?.status}
            onChange={(e) =>
              dispatchFilters({
                type: FiltersActions.set,
                payload: { key: 'status', value: e.target.value },
              })
            }
          >
            <option value={undefined}>{t('categories.organizer.filters.status.all')}</option>
            <option value="published">{t('categories.organizer.filters.status.published')}</option>
            <option value="draft">{t('categories.organizer.filters.status.draft')}</option>
          </Select>
        </FiltersBox>
      </EntryListHead>
      <StyledEntryListBody>
        <EntryListSort>
          <Select
            id={`entry-sort-${pseudoUID}`}
            label="Sort by"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <option value="updatedAt">Updated</option>
            <option value="createdAt">Created</option>
            <option value="name">Name</option>
          </Select>
          <Select
            id={`entry-order-${pseudoUID}`}
            label="Order"
            onChange={(e) => setSortOrder(e.target.value as Order)}
            value={sortOrder}
          >
            <option value={Order.DESC}>DESC</option>
            <option value={Order.ASC}>ASC</option>
          </Select>
        </EntryListSort>
        <EntryCardGrid expanded={expanded}>{cards}</EntryCardGrid>
        {/* <Table
          columns={[
            { title: t('general.name') as string, bold: true },
            { title: t('general.name') as string },
          ]}
          content={listContent}
          narrow={!expanded}
        /> */}
        {lastPage > 1 && (
          <EntryListPagination
            currentPage={currentPage}
            lastPage={lastPage}
            totalEntries={totalEntries}
            entriesPerPage={entriesPerPage}
            nextPage={() => (currentPage < lastPage ? setCurrentPage(currentPage + 1) : undefined)}
            previousPage={() => (currentPage > 1 ? setCurrentPage(currentPage - 1) : undefined)}
            goToPage={(index: number) => (index <= lastPage ? setCurrentPage(index) : undefined)}
            expanded={expanded}
          />
        )}
      </StyledEntryListBody>
    </div>
  );
};
