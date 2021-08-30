import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StyledEntryListBody } from '.';
import { Categories, useCategories } from '../../config/categories';
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
import { NavigationContext } from '../navigation/NavigationContext';
import { Select } from '../select';
import { EntryListHead } from './EntryListHead';
import { EntryListPagination } from './EntryListPagination';
import { EntryCard, EntryCardGrid, EntryCardTypesSubjects } from './EntryCard';
import { PublishedStatus } from '../../lib/api/types/general';
import { RadioSwitch } from '../RadioSwitch';
import { EntryListContext, EntryListView, FiltersActions } from './EntryListContext';
import { Table, TableProps } from '../table';
import { StatusFlag } from '../Status/StatusFlag';
import { DateFormat, useDate } from '../../lib/date';
import { StyledTableLinkText, TableLink } from '../table/TableLink';
import { ButtonLink } from '../button/ButtonLink';
import { ButtonColor, ButtonSize } from '../button';
import Link from 'next/link';
import { EntryListFiltersBox, StyledFilters } from './EntryListFiltersBox';

const StyledOrganizerList = styled.div`
  flex-grow: 1;
  min-height: 100%;
  background: var(--grey-200);
`;

const viewEntriesPerPageMap = {
  cards: 8,
  table: 16,
};

const StyledEntryListTable = styled.div`
  padding: 0 0 1.5rem;
`;

interface ListLinkProps {
  children: React.ReactNode;
}

export interface OrganizerListProps {
  expanded: boolean;
  expandable?: boolean;
  enableUltraWideLayout?: boolean;
  customEntryOnClick?: (categoryName: Categories, entryId: string) => void;
  activeEntryId?: string;
}

export const OrganizerList: React.FC<OrganizerListProps> = ({
  expanded,
  expandable = true,
  enableUltraWideLayout = true,
  customEntryOnClick,
  activeEntryId,
}: OrganizerListProps) => {
  const categories = useCategories();
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();
  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setMenuExpanded } = useContext(NavigationContext);
  const {
    getCurrentPage,
    setCurrentPage,
    getEntriesPerPage,
    setEntriesPerPage,
    getSortKey,
    setSortKey,
    getOrder,
    setOrder,
    getFilters,
    getDispatchFilters,
    getView,
    setView,
    getFiltersBoxExpanded,
    setFiltersBoxExpanded,
    setLastEntryId,
  } = useContext(EntryListContext);
  const pseudoUID = usePseudoUID();

  const typeOptions = useOrganizerTypeList();

  const listName = Categories.organizer;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);
  const view = useMemo(() => getView(listName), [getView, listName]);
  const filtersBoxExpanded = useMemo(
    () => getFiltersBoxExpanded(listName),
    [getFiltersBoxExpanded, listName]
  );
  const dispatchFilters = useMemo(
    () => getDispatchFilters(listName),
    [getDispatchFilters, listName]
  );

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
      setEntriesPerPage(listName, viewEntriesPerPageMap[view]);
      setCurrentPage(listName, 1);
    }
  }, [view, setEntriesPerPage, entriesPerPage, setCurrentPage, listName]);

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

              return (
                <EntryCard
                  onClick={() => {
                    setMenuExpanded(false);
                    setLastEntryId(Categories.organizer, id);

                    if (typeof customEntryOnClick === 'function') {
                      customEntryOnClick(Categories.organizer, id);
                    }
                  }}
                  href={typeof customEntryOnClick === 'undefined' ? href('info') : undefined}
                  menuExpanded={expanded}
                  key={index}
                  title={currentTranslation?.attributes?.name}
                  status={attributes?.status || PublishedStatus.draft}
                  active={router.asPath.includes(href()) || activeEntryId === id}
                  meta={<EntryCardTypesSubjects types={typeNames} />}
                  createdDate={attributes?.createdAt ? new Date(attributes?.createdAt) : undefined}
                  updatedDate={attributes?.updatedAt ? new Date(attributes?.updatedAt) : undefined}
                />
              );
            }
          )
        : undefined,
    [
      activeEntryId,
      expanded,
      language,
      list.data,
      locale,
      router.asPath,
      setMenuExpanded,
      setLastEntryId,
      customEntryOnClick,
    ]
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
                    setMenuExpanded(false);
                    setLastEntryId(Categories.organizer, id);
                    if (typeof customEntryOnClick === 'function') {
                      customEntryOnClick(Categories.organizer, id);
                    }
                  }}
                  href={typeof customEntryOnClick === 'undefined' ? href('info') : undefined}
                  isActive={router.asPath.includes(href()) || activeEntryId === id}
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
    [
      activeEntryId,
      list.data,
      language,
      date,
      expanded,
      locale,
      router.asPath,
      setMenuExpanded,
      setLastEntryId,
      customEntryOnClick,
    ]
  );

  return (
    <StyledOrganizerList>
      <EntryListHead
        title={t('categories.organizer.title.plural') as string}
        expanded={expanded}
        setExpanded={setMenuExpanded}
        expandable={expandable}
        actionButton={
          <Link href={routes.createOrganizer({ locale })} passHref>
            <ButtonLink
              size={ButtonSize.big}
              color={ButtonColor.white}
              icon="Plus"
              onClick={() => setMenuExpanded(false)}
            >
              {t('categories.organizer.form.create')}
            </ButtonLink>
          </Link>
        }
      />

      <EntryListFiltersBox
        isCollapsed={filtersBoxExpanded}
        setIsCollapsed={(collapsed: boolean) => setFiltersBoxExpanded(listName, collapsed)}
        expanded={expanded}
        activeFiltersCount={activeFiltersCount}
      >
        <StyledFilters expanded={expanded}>
          <Select
            label={t('categories.organizer.filters.type.label') as string}
            id={`entry-filter-type-${pseudoUID}`}
            value={filters?.type}
            onChange={(e) => {
              setCurrentPage(listName, 1);
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
              setCurrentPage(listName, 1);
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
              setCurrentPage(listName, 1);
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
        </StyledFilters>

        <StyledFilters expanded={expanded}>
          <Select
            id={`entry-sort-${pseudoUID}`}
            label={t('general.sort') as string}
            onChange={(e) => {
              setCurrentPage(listName, 1);
              setSortKey(listName, e.target.value);
            }}
            value={sortKey}
          >
            <option value="updatedAt">{t('categories.organizer.sort.updated')}</option>
            <option value="createdAt">{t('categories.organizer.sort.created')}</option>
            <option value="name">{t('categories.organizer.sort.name')}</option>
          </Select>
          <RadioSwitch
            value={order}
            name={`entry-order-${pseudoUID}`}
            onChange={(value) => {
              setCurrentPage(listName, 1);
              setOrder(listName, value as Order);
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
              setView(listName, value as EntryListView);
            }}
            label={t('categories.organizer.view.label') as string}
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
        </StyledFilters>
      </EntryListFiltersBox>
      <StyledEntryListBody>
        {view === EntryListView.cards ? (
          <EntryCardGrid expanded={expanded} enableUltraWideLayout={enableUltraWideLayout}>
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
              <EntryCardGrid expanded={expanded} enableUltraWideLayout={enableUltraWideLayout}>
                <div>{t('categories.organizer.list.nothing')}</div>
              </EntryCardGrid>
            ) : (
              <EntryCardGrid expanded={expanded} enableUltraWideLayout={enableUltraWideLayout}>
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
            nextPage={() =>
              currentPage < lastPage ? setCurrentPage(listName, currentPage + 1) : undefined
            }
            previousPage={() =>
              currentPage > 1 ? setCurrentPage(listName, currentPage - 1) : undefined
            }
            goToPage={(index: number) =>
              index <= lastPage ? setCurrentPage(listName, index) : undefined
            }
            expanded={expanded}
          />
        )}
      </StyledEntryListBody>
    </StyledOrganizerList>
  );
};
