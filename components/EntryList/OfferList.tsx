import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { EntryListPlaceholder, StyledEntryListBody } from '.';
import { Categories, useCategories } from '../../config/categories';
import { OfferList as OfferListCall } from '../../lib/api';
import { Offer, OfferTranslation, OfferTypeTranslation } from '../../lib/api/types/offer';
import {
  Order,
  useCreateOffer,
  useList,
  useOfferMainTypeList,
  useOfferTypeList,
} from '../../lib/categories';
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
import { Button, ButtonColor, ButtonSize } from '../button';
import { EntryListFiltersBox, StyledFilters } from './EntryListFiltersBox';
import { useOrganizerId } from '../../lib/useOrganizer';
import { useLoadingScreen } from '../Loading/LoadingScreen';

const StyledOrganizerList = styled.div`
  flex-grow: 1;
  min-height: 100%;
  background: var(--white);
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

interface OfferListProps {
  expanded: boolean;
  expandable?: boolean;
  enableUltraWideLayout?: boolean;
}

export const OfferList: React.FC<OfferListProps> = ({
  expanded,
  expandable = true,
  enableUltraWideLayout = true,
}: OfferListProps) => {
  const categories = useCategories();
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();
  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setMenuExpanded, menuExpanded } = useContext(NavigationContext);
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
    getFiltersBoxExpanded,
    setFiltersBoxExpanded,
    setLastEntryId,
  } = useContext(EntryListContext);
  const pseudoUID = usePseudoUID();
  const listName = Categories.offer;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);
  const view = useMemo(
    () => (menuExpanded ? EntryListView.table : EntryListView.cards),
    [menuExpanded]
  );
  const filtersBoxExpanded = useMemo(
    () => getFiltersBoxExpanded(listName),
    [getFiltersBoxExpanded, listName]
  );
  const dispatchFilters = useMemo(
    () => getDispatchFilters(listName),
    [getDispatchFilters, listName]
  );
  const loadingScreen = useLoadingScreen();
  const createOffer = useCreateOffer();
  const organizerId = useOrganizerId();
  const mainTypeOptions = useOfferMainTypeList();
  const typeOptions = useOfferTypeList();

  const list = useList<OfferListCall, Offer>(
    categories.offer,
    currentPage,
    entriesPerPage,
    [...Object.entries(filters), ['organizers', organizerId]],
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
              const typeNames = relations?.types?.map((type) => {
                const typeTranslation = getTranslation<OfferTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return typeTranslation?.attributes.name;
              });
              const mainTypeNames = relations?.mainType?.map((type) => {
                const mainTypeTranslation = getTranslation<OfferTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return mainTypeTranslation?.attributes.name;
              });
              const href = (sub?: string) =>
                routes[Routes.offer]({
                  locale,
                  query: { organizer: organizerId, id, sub },
                });

              const translations = relations?.translations;
              const currentTranslation = translations
                ? getTranslation<OfferTranslation>(language, translations)
                : undefined;

              return (
                <EntryCard
                  onClick={() => {
                    setMenuExpanded(false);
                    setLastEntryId(Categories.offer, id);
                  }}
                  href={href('info')}
                  menuExpanded={expanded}
                  key={index}
                  title={currentTranslation?.attributes?.name}
                  status={attributes?.status || PublishedStatus.draft}
                  active={router.asPath.includes(href())}
                  createdDate={attributes?.createdAt ? new Date(attributes?.createdAt) : undefined}
                  updatedDate={attributes?.updatedAt ? new Date(attributes?.updatedAt) : undefined}
                  meta={<EntryCardTypesSubjects types={[...mainTypeNames, ...typeNames]} />}
                />
              );
            }
          )
        : undefined,
    [
      expanded,
      language,
      list.data,
      locale,
      router.asPath,
      setMenuExpanded,
      setLastEntryId,
      organizerId,
    ]
  );

  const rows: TableProps['content'] = useMemo(
    () =>
      list?.data
        ? Object.values(Array.isArray(list.data) ? list.data : [list.data]).map(
            ({ attributes, relations, id }) => {
              const translations = relations?.translations;

              const currentTranslation = translations
                ? getTranslation<OfferTranslation>(language, translations)
                : undefined;

              const href = (sub?: string) =>
                routes[Routes.offer]({
                  locale,
                  query: { organizer: organizerId, id, sub },
                });

              const ListLink: React.FC<ListLinkProps> = ({ children }: ListLinkProps) => (
                <TableLink
                  onClick={() => {
                    setMenuExpanded(false);
                    setLastEntryId(Categories.organizer, id);
                  }}
                  href={href('info')}
                  isActive={router.asPath.includes(href())}
                >
                  {children}
                </TableLink>
              );

              const typeNames = relations?.types?.map((type) => {
                const typeTranslation = getTranslation<OfferTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return typeTranslation?.attributes.name;
              });

              const mainTypeNames = relations?.mainType?.map((type) => {
                const mainTypeTranslation = getTranslation<OfferTypeTranslation>(
                  language,
                  type.relations.translations
                );
                return mainTypeTranslation?.attributes.name;
              });

              return {
                contents: [
                  <StyledTableLinkText key={0}>
                    {currentTranslation?.attributes?.name}
                  </StyledTableLinkText>,
                  mainTypeNames?.join(', '),
                  typeNames?.join(', '),
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
      list.data,
      language,
      date,
      expanded,
      locale,
      router.asPath,
      setMenuExpanded,
      setLastEntryId,
      organizerId,
    ]
  );

  return (
    <StyledOrganizerList>
      <EntryListHead
        title={t('categories.offer.title.plural') as string}
        expanded={expanded}
        setExpanded={setMenuExpanded}
        expandable={expandable}
        actionButton={
          <Button
            size={ButtonSize.big}
            color={ButtonColor.white}
            icon="Plus"
            onClick={async () => {
              loadingScreen(
                t('categories.offer.form.create'),
                async () => await createOffer(),
                t('general.takeAFewSeconds')
              );
            }}
          >
            {t('categories.offer.form.create')}
          </Button>
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
          <Select
            label={t('categories.offer.filters.mainType.label') as string}
            id={`entry-filter-mainType-${pseudoUID}`}
            value={filters?.mainType}
            onChange={(e) => {
              setCurrentPage(listName, 1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: {
                  key: 'mainType',
                  value: e.target.value !== '' ? e.target.value : undefined,
                },
              });
            }}
          >
            <option value="">{t('categories.offer.filters.mainType.all')}</option>
            {mainTypeOptions?.map(({ id, relations }, index) => {
              const typeTranslation = getTranslation<OfferTypeTranslation>(
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
            label={t('categories.offer.filters.type.label') as string}
            id={`entry-filter-type-${pseudoUID}`}
            value={filters?.type}
            onChange={(e) => {
              setCurrentPage(listName, 1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: {
                  key: 'type',
                  value: e.target.value !== '' ? e.target.value : undefined,
                },
              });
            }}
          >
            <option value="">{t('categories.offer.filters.type.all')}</option>
            {typeOptions?.map(({ id, relations }, index) => {
              const typeTranslation = getTranslation<OfferTypeTranslation>(
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
        </StyledFilters>
        {!menuExpanded && (
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
            {/* <RadioSwitch
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
          /> */}
          </StyledFilters>
        )}
      </EntryListFiltersBox>
      <StyledEntryListBody>
        {view === EntryListView.cards ? (
          <EntryCardGrid expanded={expanded} enableUltraWideLayout={enableUltraWideLayout}>
            {cards && cards.length > 0 ? (
              cards
            ) : cards && cards.length === 0 ? (
              <EntryListPlaceholder>
                {activeFiltersCount === 0
                  ? t('categories.offer.list.nothing')
                  : t('categories.offer.list.nothingFilter')}
              </EntryListPlaceholder>
            ) : (
              <EntryListPlaceholder>{t('categories.offer.list.loading')}</EntryListPlaceholder>
            )}
          </EntryCardGrid>
        ) : (
          <StyledEntryListTable>
            {/* {rows && rows.length > 0 ? ( */}
            <Table
              columns={[
                {
                  title: t('categories.offer.form.name') as string,
                  bold: true,
                  width: 4,
                  sort: {
                    order,
                    onClick: () => {
                      if (sortKey === 'name') {
                        setOrder(listName, order === Order.ASC ? Order.DESC : Order.ASC);
                      }
                      setCurrentPage(listName, 1);
                      setSortKey(listName, 'name');
                    },
                    active: sortKey === 'name',
                  },
                },
                { title: t('categories.offer.filters.mainType.label') as string, width: 4 },
                { title: t('categories.offer.filters.type.label') as string, width: 4 },
                { title: t('statusBar.status') as string, width: 4 },
                {
                  title: t('categories.organizer.table.updated') as string,
                  width: 2,
                  sort: {
                    order,
                    onClick: () => {
                      if (sortKey === 'updatedAt') {
                        setOrder(listName, order === Order.ASC ? Order.DESC : Order.ASC);
                      }
                      setCurrentPage(listName, 1);
                      setSortKey(listName, 'updatedAt');
                    },
                    active: sortKey === 'updatedAt',
                  },
                },
                {
                  title: t('categories.organizer.table.created') as string,
                  width: 2,
                  sort: {
                    order,
                    onClick: () => {
                      if (sortKey === 'createdAt') {
                        setOrder(listName, order === Order.ASC ? Order.DESC : Order.ASC);
                      }
                      setCurrentPage(listName, 1);
                      setSortKey(listName, 'createdAt');
                    },
                    active: sortKey === 'createdAt',
                  },
                },
              ].slice(0, !expanded ? 2 : undefined)}
              content={rows}
              narrow={!expanded}
              placeholder={
                rows && rows.length === 0
                  ? activeFiltersCount === 0
                    ? t('categories.offer.list.nothing')
                    : t('categories.offer.list.nothingFilter')
                  : t('categories.offer.list.loading')
              }
            />
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
