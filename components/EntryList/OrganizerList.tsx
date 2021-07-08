import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';
import { StyledEntryListBody } from '.';
import { useCategories } from '../../config/categories';
import { OrganizerList as OrganizerListCall } from '../../lib/api';
import {
  Organizer,
  OrganizerSubjectTranslation,
  OrganizerTranslation,
  OrganizerTypeTranslation,
} from '../../lib/api/types/organizer';
import { Order, useList, useOrganizerTypeList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Routes, routes, useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { useCollapsable } from '../collapsable';
import { NavigationContext } from '../navigation/NavigationContext';
import { Select, SelectLabelPosition } from '../select';
import { EntryListHead } from './EntryListHead';
import { EntryListPagination } from './EntryListPagination';
import { EntryCard, EntryCardGrid, EntryCardTypesSubjects } from './EntryCard';
import { PublishedStatus } from '../../lib/api/types/general';
import { RadioSwitch, RadioSwitchLabelPosition } from '../RadioSwitch';
import { EntryListContext, EntryListView, FiltersActions } from './EntryListContext';
import { mq } from '../globals/Constants';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Table, TableProps } from '../table';
import { StatusFlag } from '../Status/StatusFlag';
import { DateFormat, useDate } from '../../lib/date';
import { StyledTableLinkText, TableLink } from '../table/TableLink';

const StyledOrganizerList = styled.div`
  flex-grow: 1;
  min-height: 100%;
  background: var(--white);
`;

const viewEntriesPerPageMap = {
  cards: 8,
  table: 16,
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

const StyledFilterBoxChild = styled.div``;

const StyledFiltersBoxChildren = styled.div<{ expanded: boolean }>`
  display: flex;

  ${({ expanded }) =>
    expanded
      ? css`
          ${StyledFilterBoxChild} {
            margin-right: 0.75rem;
            flex-grow: 1;
            flex-basis: 0;
          }
        `
      : css`
          flex-direction: column;
          padding: 0.75rem;
          border-top: 1px solid var(--grey-400);
          grid-template-columns: auto;

          ${StyledFilterBoxChild} {
            margin-bottom: 0.75rem;
          }
        `}

  ${StyledFilterBoxChild} {
    &:last-of-type {
      margin: 0;
    }
  }
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
  activeFiltersCount?: number;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const FiltersBox: React.FC<PropsWithChildren<FiltersBoxProps>> = ({
  expanded,
  children,
  activeFiltersCount,
  isCollapsed,
  setIsCollapsed,
}: PropsWithChildren<FiltersBoxProps>) => {
  const t = useT();

  const wrappedChildren = (
    <StyledFiltersBoxChildren expanded={expanded}>
      {React.Children.map(children, (child, index) => (
        <StyledFilterBoxChild key={index}>{child}</StyledFilterBoxChild>
      ))}
    </StyledFiltersBoxChildren>
  );

  const { renderedCollapsable } = useCollapsable(wrappedChildren, isCollapsed, setIsCollapsed);

  return (
    <StyledFiltersBox expanded={expanded}>
      {expanded ? (
        <>
          <StyledFiltersBoxTitle>{t('general.filter')}</StyledFiltersBoxTitle>
          {wrappedChildren}
        </>
      ) : (
        <>
          <StyledFiltersBoxTitleButton
            isCollapsed={isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {t('general.filter')}
            {activeFiltersCount
              ? ` (${t('categories.organizer.filters.activeFilters', { activeFiltersCount })})`
              : ''}
            <Plus />
          </StyledFiltersBoxTitleButton>
          {renderedCollapsable}
        </>
      )}
    </StyledFiltersBox>
  );
};

const StyledEntryListTable = styled.div`
  padding: 1.5rem 0;
`;

const EntryListSort = styled.div<{ expanded: boolean }>`
  padding: 0 0.75rem;
  display: grid;
  row-gap: 0.75rem;

  > *:last-of-type {
    padding: 0.75rem 0 0;
  }

  ${mq(Breakpoint.widish)} {
    ${({ expanded }) =>
      expanded
        ? css`
            padding: 0.75rem;
            display: flex;
            justify-content: flex-end;

            > * {
              padding: 0 0 0 0.75rem;

              &:last-of-type {
                padding: 0 0 0 1.5rem;
              }
            }
          `
        : ''}
  }
`;

interface ListLinkProps {
  children: React.ReactNode;
}

export const OrganizerList: React.FC<OrganizerListProps> = ({ expanded }: OrganizerListProps) => {
  const categories = useCategories();
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();
  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setNavigationOpen, setMenuExpanded } = useContext(NavigationContext);
  const {
    currentPage,
    setCurrentPage,
    entriesPerPage,
    setEntriesPerPage,
    sortKey,
    setSortKey,
    order,
    setOrder,
    filters,
    dispatchFilters,
    view,
    setView,
    filtersBoxExpanded,
    setFiltersBoxExpanded,
  } = useContext(EntryListContext);
  const isWidishOrWider = useBreakpointOrWider(Breakpoint.widish);
  const pseudoUID = usePseudoUID();

  const typeOptions = useOrganizerTypeList();

  const list = useList<OrganizerListCall, Organizer>(
    categories.organizer,
    currentPage,
    entriesPerPage,
    Object.entries(filters),
    { key: sortKey, order }
  );

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters)?.filter(
        (filter) => filter && filter[0] !== undefined && filter[0] !== ''
      ).length,
    [filters]
  );

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

  useEffect(() => {
    if (viewEntriesPerPageMap[view] !== entriesPerPage) {
      setEntriesPerPage(viewEntriesPerPageMap[view]);
      setCurrentPage(1);
    }
  }, [view, setEntriesPerPage, entriesPerPage, setCurrentPage]);

  const date = useDate();

  const cards = useMemo(
    () =>
      list?.data
        ? Object.values(Array.isArray(list.data) ? list.data : [list.data]).map(
            ({ attributes, relations, id }, index) => {
              const href = (sub?: string) =>
                routes[Routes.organizer]({
                  locale,
                  query: { id, sub },
                });

              const translations = relations?.translations;
              const currentTranslation = translations
                ? getTranslation<OrganizerTranslation>(language, translations)
                : undefined;
              const typeNames = relations?.types?.map((type) => {
                const typeTranslation = getTranslation<OrganizerTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return typeTranslation?.attributes.name;
              });

              const subjectNames = relations?.subjects?.map((subject) => {
                const subjectTranslation = getTranslation<OrganizerSubjectTranslation>(
                  language,
                  subject.relations.translations
                );
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
                  status={attributes?.status || PublishedStatus.draft}
                  active={router.asPath.includes(href())}
                  meta={<EntryCardTypesSubjects types={typeNames} subjects={subjectNames} />}
                  createdDate={attributes?.createdAt ? new Date(attributes?.createdAt) : undefined}
                  updatedDate={attributes?.updatedAt ? new Date(attributes?.updatedAt) : undefined}
                />
              );
            }
          )
        : undefined,
    [expanded, language, list.data, locale, router.asPath, setMenuExpanded, setNavigationOpen]
  );

  const rows: TableProps['content'] = useMemo(
    () =>
      list?.data
        ? Object.values(Array.isArray(list.data) ? list.data : [list.data]).map(
            ({ attributes, relations, id }) => {
              const translations = relations?.translations;

              const currentTranslation = translations
                ? getTranslation<OrganizerTranslation>(language, translations)
                : undefined;

              const typeNames = relations?.types?.map((type) => {
                const typeTranslation = getTranslation<OrganizerTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return typeTranslation?.attributes.name;
              });

              const subjectNames = relations?.subjects?.map((subject) => {
                const subjectTranslation = getTranslation<OrganizerSubjectTranslation>(
                  language,
                  subject.relations.translations
                );
                return subjectTranslation?.attributes.name;
              });

              const href = (sub?: string) =>
                routes[Routes.organizer]({
                  locale,
                  query: { id, sub },
                });

              const ListLink: React.FC<ListLinkProps> = ({ children }: ListLinkProps) => (
                <TableLink
                  onClick={() => {
                    setNavigationOpen(false);
                    setMenuExpanded(false);
                  }}
                  href={href('info')}
                  isActive={router.asPath.includes(href())}
                >
                  {children}
                </TableLink>
              );

              return {
                contents: [
                  <StyledTableLinkText key={0}>
                    {currentTranslation?.attributes?.name}
                  </StyledTableLinkText>,
                  typeNames.join(', '),
                  subjectNames.join(', '),
                  <StatusFlag status={attributes?.status} key={1} />,
                  attributes?.updatedAt
                    ? date(new Date(attributes?.updatedAt), DateFormat.date)
                    : undefined,
                  attributes?.createdAt
                    ? date(new Date(attributes?.createdAt), DateFormat.date)
                    : undefined,
                ].slice(0, !expanded ? 2 : undefined),
                Wrapper: ListLink,
              };
            }
          )
        : undefined,
    [list.data, language, date, expanded, locale, router.asPath, setNavigationOpen, setMenuExpanded]
  );

  return (
    <StyledOrganizerList>
      <EntryListHead
        title={t('categories.organizer.title.plural') as string}
        expanded={expanded}
        accentColor="var(--red)"
      >
        <FiltersBox
          isCollapsed={filtersBoxExpanded}
          setIsCollapsed={setFiltersBoxExpanded}
          expanded={expanded}
          activeFiltersCount={activeFiltersCount}
        >
          <Select
            label={t('categories.organizer.filters.type.label') as string}
            id={`entry-filter-type-${pseudoUID}`}
            value={filters?.type}
            onChange={(e) => {
              setCurrentPage(1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: { key: 'type', value: e.target.value !== '' ? e.target.value : undefined },
              });

              dispatchFilters({
                type: FiltersActions.set,
                payload: { key: 'subject', value: undefined },
              });
            }}
          >
            <option value="">{t('categories.organizer.filters.type.all')}</option>
            {typeOptions?.map(({ id, relations }, index) => {
              const typeTranslation = getTranslation<OrganizerTypeTranslation>(
                language,
                relations.translations
              );

              return (
                <option key={index} value={String(id)}>
                  {typeTranslation?.attributes?.name}
                </option>
              );
            })}
          </Select>
          <Select
            label={t('categories.organizer.filters.subject.label') as string}
            id={`entry-filter-subject-${pseudoUID}`}
            value={filters?.subject}
            disabled={!filters?.type}
            onChange={(e) => {
              setCurrentPage(1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: {
                  key: 'subject',
                  value: e.target.value !== '' ? e.target.value : undefined,
                },
              });
            }}
          >
            <option value="">
              {!filters?.type
                ? t('categories.organizer.filters.subject.typeFirst')
                : t('categories.organizer.filters.subject.all')}
            </option>
            {typeOptions
              ?.filter((typeOption) => typeOption.id === parseInt(filters?.type, 10))
              .map(({ relations }) => {
                const subjects = relations?.subjects?.map(
                  ({ relations: subjectRelations, id: subjectId }, index) => {
                    const subjectTranslation = getTranslation<OrganizerSubjectTranslation>(
                      language,
                      subjectRelations?.translations
                    );
                    return (
                      <option key={index} value={String(subjectId)}>
                        {subjectTranslation?.attributes?.name}
                      </option>
                    );
                  }
                );

                return subjects;
              })}
          </Select>
          <Select
            label={t('categories.organizer.filters.status.label') as string}
            id={`entry-filter-status-${pseudoUID}`}
            value={filters?.status}
            onChange={(e) => {
              setCurrentPage(1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: {
                  key: 'status',
                  value: e.target.value !== '' ? e.target.value : undefined,
                },
              });
            }}
          >
            <option value="">{t('categories.organizer.filters.status.all')}</option>
            <option value="published">{t('categories.organizer.filters.status.published')}</option>
            <option value="draft">{t('categories.organizer.filters.status.draft')}</option>
          </Select>
        </FiltersBox>
      </EntryListHead>
      <StyledEntryListBody>
        <EntryListSort expanded={expanded}>
          <Select
            id={`entry-sort-${pseudoUID}`}
            label={t('general.sort') as string}
            onChange={(e) => {
              setCurrentPage(1);
              setSortKey(e.target.value);
            }}
            value={sortKey}
            labelPosition={
              expanded && isWidishOrWider ? SelectLabelPosition.left : SelectLabelPosition.top
            }
          >
            <option value="updatedAt">{t('categories.organizer.sort.updated')}</option>
            <option value="createdAt">{t('categories.organizer.sort.created')}</option>
            <option value="name">{t('categories.organizer.sort.name')}</option>
          </Select>
          <RadioSwitch
            value={order}
            name={`entry-order-${pseudoUID}`}
            onChange={(value) => {
              setCurrentPage(1);
              setOrder(value as Order);
            }}
            options={[
              {
                value: Order.ASC,
                label: t('general.ascending') as string,
                ariaLabel: t('general.ascendingAriaLabel') as string,
                icon: 'ArrowUp',
              },
              {
                value: Order.DESC,
                label: t('general.descending') as string,
                ariaLabel: t('general.descendingAriaLabel') as string,
                icon: 'ArrowDown',
              },
            ]}
          />
          <RadioSwitch
            value={view}
            name={`entry-view-${pseudoUID}`}
            onChange={(value) => {
              setView(value as EntryListView);
            }}
            label={t('categories.organizer.view.label') as string}
            labelPosition={
              expanded && isWidishOrWider
                ? RadioSwitchLabelPosition.left
                : RadioSwitchLabelPosition.top
            }
            options={[
              {
                value: EntryListView.cards,
                label: t('categories.organizer.view.cards') as string,
                icon: 'Grid',
              },
              {
                value: EntryListView.table,
                label: t('categories.organizer.view.table') as string,
                icon: 'AlignJustify',
              },
            ]}
          />
        </EntryListSort>
        {view === EntryListView.cards ? (
          <EntryCardGrid expanded={expanded}>
            {cards && cards.length > 0 ? (
              cards
            ) : cards && cards.length === 0 ? (
              <div>{t('categories.organizer.list.nothing')}</div>
            ) : (
              <div>{t('categories.organizer.list.loading')}</div>
            )}
          </EntryCardGrid>
        ) : (
          <StyledEntryListTable>
            {rows && rows.length > 0 ? (
              <Table
                columns={[
                  { title: t('categories.organizer.form.name') as string, bold: true, width: 5 },
                  { title: t('categories.organizer.form.type') as string, width: 4 },
                  { title: t('categories.organizer.form.subjects') as string, width: 4 },
                  { title: t('statusBar.status') as string, width: 3 },
                  { title: t('categories.organizer.table.updated') as string, width: 2 },
                  { title: t('categories.organizer.table.created') as string, width: 2 },
                ].slice(0, !expanded ? 2 : undefined)}
                content={rows}
                narrow={!expanded}
              />
            ) : rows && rows.length === 0 ? (
              <EntryCardGrid expanded={expanded}>
                <div>{t('categories.organizer.list.nothing')}</div>
              </EntryCardGrid>
            ) : (
              <EntryCardGrid expanded={expanded}>
                <div>{t('categories.organizer.list.loading')}</div>
              </EntryCardGrid>
            )}
          </StyledEntryListTable>
        )}
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
    </StyledOrganizerList>
  );
};
