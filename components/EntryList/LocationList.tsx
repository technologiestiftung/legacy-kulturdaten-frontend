import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { EntryListPlaceholder, StyledEntryListBody } from '.';
import { Categories, useCategories } from '../../config/categories';
import { LocationList as LocationListCall } from '../../lib/api';
import { Location, LocationTranslation, LocationType } from '../../lib/api/types/location';
import { CategoryExportType, Order, useCreateLocation, useList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Routes, routes, useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { NavigationContext } from '../navigation/NavigationContext';
import { Select } from '../select';
import { EntryListHead } from './EntryListHead';
import { EntryListPagination } from './EntryListPagination';
import { EntryCard, EntryCardGrid, EntryCardText } from './EntryCard';
import { PublishedStatus } from '../../lib/api/types/general';
import { RadioSwitch } from '../RadioSwitch';
import { EntryListContext, EntryListView, FiltersActions } from './EntryListContext';
import { Table, TableProps } from '../table';
import { StatusFlag } from '../Status/StatusFlag';
import { DateFormat, useDate } from '../../lib/date';
import { StyledTableLinkText, TableLink } from '../table/TableLink';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '../button';
import { EntryListFiltersBox, StyledFilters } from './EntryListFiltersBox';
import { useOrganizerId } from '../../lib/useOrganizer';
import { useLoadingScreen } from '../Loading/LoadingScreen';
import { useDownload } from '../../lib/api/download';
import {
  DropdownMenu,
  DropdownMenuButtonColor,
  DropdownMenuButtonSize,
  DropdownMenuForm,
} from '../DropdownMenu';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { defaultLanguage } from '../../config/locale';
import { Input, InputType } from '../input';

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

interface LocationListProps {
  expanded: boolean;
  expandable?: boolean;
  enableUltraWideLayout?: boolean;
  customEntryOnClick?: (categoryName: Categories, entryId: string) => void;
  activeEntryId?: string;
  chosenEntryIds?: string[];
  showAllLocationsSwitch?: boolean;
  hideExport?: boolean;
}

export const LocationList: React.FC<LocationListProps> = ({
  expanded,
  expandable = true,
  enableUltraWideLayout = true,
  customEntryOnClick,
  activeEntryId,
  chosenEntryIds,
  showAllLocationsSwitch = false,
  hideExport = false,
}: LocationListProps) => {
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
    getFiltersBoxExpanded,
    setFiltersBoxExpanded,
    setLastEntryId,
  } = useContext(EntryListContext);
  const pseudoUID = usePseudoUID();
  const listName = Categories.location;
  const filters = useMemo(() => getFilters(listName), [getFilters, listName]);
  const currentPage = useMemo(() => getCurrentPage(listName), [getCurrentPage, listName]);
  const entriesPerPage = useMemo(() => getEntriesPerPage(listName), [getEntriesPerPage, listName]);
  const sortKey = useMemo(() => getSortKey(listName), [getSortKey, listName]);
  const order = useMemo(() => getOrder(listName), [getOrder, listName]);
  const view = useMemo(() => (expanded ? EntryListView.table : EntryListView.cards), [expanded]);
  const filtersBoxExpanded = useMemo(
    () => getFiltersBoxExpanded(listName),
    [getFiltersBoxExpanded, listName]
  );
  const dispatchFilters = useMemo(
    () => getDispatchFilters(listName),
    [getDispatchFilters, listName]
  );
  const loadingScreen = useLoadingScreen();
  const createLocation = useCreateLocation();
  const organizerId = useOrganizerId();
  const download = useDownload();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);

  const [search, setSearch] = useState<string>();

  const [showAllLocations, setShowAllLocation] = useState(showAllLocationsSwitch ? true : false);

  // Set status filter to published if all locations are shown.
  useEffect(() => {
    if (showAllLocationsSwitch && showAllLocations && filters?.status !== 'published') {
      dispatchFilters({
        type: FiltersActions.set,
        payload: {
          key: 'status',
          value: 'published',
        },
      });
    }
  }, [dispatchFilters, showAllLocations, showAllLocationsSwitch, filters?.status]);

  const list = useList<LocationListCall, Location>(
    categories.location,
    currentPage,
    entriesPerPage,
    [
      ...Object.entries(filters),
      ['organizer', showAllLocationsSwitch && showAllLocations ? undefined : organizerId],
    ],
    { key: sortKey, order },
    true,
    search
  );

  const activeFiltersCount = useMemo(
    () =>
      Object.values(filters)?.filter(
        (filter) => filter && filter[0] !== undefined && filter[0] !== ''
      ).length + search
        ? 1
        : 0,
    [filters, search]
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
                routes[Routes.location]({
                  locale,
                  query: { id, sub, organizer: organizerId },
                });

              const translations = relations?.translations;
              const currentTranslation = translations
                ? getTranslation<LocationTranslation>(language, translations)
                : undefined;

              const defaultTranslation = translations
                ? getTranslation<LocationTranslation>(defaultLanguage, translations)
                : undefined;

              const address = relations?.address;

              return (
                <EntryCard
                  onClick={() => {
                    if (activeEntryId === id || !chosenEntryIds?.includes(id)) {
                      setMenuExpanded(false);
                      setLastEntryId(Categories.location, id);

                      if (typeof customEntryOnClick === 'function') {
                        customEntryOnClick(Categories.organizer, id);
                      }
                    }
                  }}
                  href={typeof customEntryOnClick === 'undefined' ? href('info') : undefined}
                  menuExpanded={expanded}
                  key={index}
                  title={
                    currentTranslation?.attributes?.name ||
                    defaultTranslation?.attributes?.name ||
                    categories?.location?.placeholderName
                  }
                  status={attributes?.status || PublishedStatus.draft}
                  active={router.asPath.includes(href()) || activeEntryId === id}
                  forbidden={activeEntryId !== id && chosenEntryIds?.includes(id)}
                  createdDate={attributes?.createdAt ? new Date(attributes?.createdAt) : undefined}
                  updatedDate={attributes?.updatedAt ? new Date(attributes?.updatedAt) : undefined}
                  meta={
                    attributes?.type === LocationType.physical ? (
                      address && (
                        <EntryCardText>
                          {[
                            address.attributes.street1,
                            address.attributes.street2,
                            address.attributes.zipCode,
                            address.attributes.city,
                          ]
                            .filter((text) => text?.length > 0)
                            .join(', ')}
                        </EntryCardText>
                      )
                    ) : (
                      <EntryCardText>virtuell</EntryCardText>
                    )
                  }
                />
              );
            }
          )
        : undefined,
    [
      list.data,
      language,
      customEntryOnClick,
      expanded,
      router.asPath,
      activeEntryId,
      locale,
      organizerId,
      setMenuExpanded,
      setLastEntryId,
      categories?.location?.placeholderName,
      chosenEntryIds,
    ]
  );

  const rows: TableProps['content'] = useMemo(
    () =>
      list?.data
        ? Object.values(Array.isArray(list.data) ? list.data : [list.data]).map(
            ({ attributes, relations, id }) => {
              const translations = relations?.translations;

              const currentTranslation = translations
                ? getTranslation<LocationTranslation>(language, translations)
                : undefined;

              const defaultTranslation = translations
                ? getTranslation<LocationTranslation>(defaultLanguage, translations)
                : undefined;

              const href = (sub?: string) =>
                routes[Routes.location]({
                  locale,
                  query: { id, sub, organizer: organizerId },
                });

              const ListLink: React.FC<ListLinkProps> = ({ children }: ListLinkProps) => (
                <TableLink
                  onClick={() => {
                    if (activeEntryId === id || !chosenEntryIds?.includes(id)) {
                      setMenuExpanded(false);
                      setLastEntryId(Categories.location, id);

                      if (typeof customEntryOnClick === 'function') {
                        customEntryOnClick(Categories.organizer, id);
                      }
                    }
                  }}
                  href={typeof customEntryOnClick === 'undefined' ? href('info') : undefined}
                  isActive={router.asPath.includes(href()) || activeEntryId === id}
                  forbidden={activeEntryId !== id && chosenEntryIds?.includes(id)}
                >
                  {children}
                </TableLink>
              );

              const address = relations?.address;

              return {
                contents: [
                  <StyledTableLinkText key={0}>
                    {currentTranslation?.attributes?.name ||
                      defaultTranslation?.attributes?.name ||
                      categories?.location?.placeholderName}
                  </StyledTableLinkText>,
                  `${
                    attributes?.type === LocationType.physical && address && address.attributes
                      ? [
                          address.attributes.street1,
                          address.attributes.street2,
                          address.attributes.zipCode,
                          address.attributes.city,
                        ]
                          .filter((text) => text?.length > 0 && text !== 'undefined')
                          .join(', ')
                      : attributes?.url
                      ? attributes.url
                      : t('categories.location.list.addressPlaceholder')
                  }`,
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
      customEntryOnClick,
      activeEntryId,
      list.data,
      language,
      date,
      expanded,
      locale,
      router.asPath,
      setMenuExpanded,
      setLastEntryId,
      organizerId,
      categories?.location?.placeholderName,
      chosenEntryIds,
      t,
    ]
  );

  return (
    <StyledOrganizerList>
      <EntryListHead
        title={t('categories.location.title.plural') as string}
        expanded={expanded}
        setExpanded={setMenuExpanded}
        expandable={expandable}
        actionButton={
          <Button
            size={ButtonSize.big}
            color={ButtonColor.white}
            icon="Plus"
            onClick={async () => {
              createLocation(),
                t('general.takeAFewSeconds')
            }}
          >
            {t('categories.location.form.create')}
          </Button>
        }
        menu={
          !hideExport && list?.data?.length > 0 ? (
            <DropdownMenu
              icon="MoreVertical"
              form={DropdownMenuForm.rounded}
              buttonAriaLabels={{
                open: t('general.actionsOpen') as string,
                close: t('general.actionsClose') as string,
              }}
              buttonSize={
                isMidOrWider ? DropdownMenuButtonSize.big : DropdownMenuButtonSize.default
              }
              buttonColor={DropdownMenuButtonColor.grey}
              menuWidth={
                expanded ? undefined : isUltraOrWider ? '22rem' : isWideOrWider ? '15rem' : '12rem'
              }
            >
              {categories?.location?.options?.export
                ?.filter(({ type }) => type === CategoryExportType.list)
                ?.map(({ format, title, route }, index) => (
                  <Button
                    key={index}
                    variant={ButtonVariant.minimal}
                    size={ButtonSize.default}
                    color={ButtonColor.white}
                    onClick={() =>
                      download(
                        route({ organizer: organizerId, format }),
                        `${categories?.location?.title?.plural}.${format}`
                      )
                    }
                  >
                    {title}
                  </Button>
                ))}
            </DropdownMenu>
          ) : undefined
        }
      />
      <EntryListFiltersBox
        isCollapsed={filtersBoxExpanded}
        setIsCollapsed={(collapsed: boolean) => setFiltersBoxExpanded(listName, collapsed)}
        expanded={expanded}
        activeFiltersCount={activeFiltersCount}
      >
        <StyledFilters expanded={expanded}>
          {showAllLocationsSwitch && (
            <RadioSwitch
              value={showAllLocations ? 'true' : 'false'}
              label={t('categories.location.list.allOrMy') as string}
              name={`location-selection-${pseudoUID}`}
              onChange={(value) => {
                setShowAllLocation(value === 'true');

                if (value === 'false') {
                  dispatchFilters({
                    type: FiltersActions.set,
                    payload: {
                      key: 'status',
                      value: undefined,
                    },
                  });
                }
              }}
              options={[
                {
                  value: 'true',
                  label: t('categories.location.list.allLocations') as string,
                  ariaLabel: t('categories.location.list.myLocations') as string,
                  icon: 'Users',
                },
                {
                  value: 'false',
                  label: t('categories.location.list.myLocations') as string,
                  ariaLabel: t('categories.location.list.myLocations') as string,
                  icon: 'User',
                },
              ]}
            />
          )}
          <Select
            label={t('categories.organizer.filters.status.label') as string}
            id={`entry-filter-status-${pseudoUID}`}
            value={filters?.status}
            disabled={showAllLocationsSwitch && showAllLocations}
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
          <Input
            label={t('categories.location.list.searchNameLabel') as string}
            type={InputType.text}
            id="test"
            value={search || ''}
            onChange={(e) => setSearch(e.target.value !== '' ? e.target.value : undefined)}
            debounce={1000}
            placeholder={t('categories.location.list.searchNamePlaceholder') as string}
          />
        </StyledFilters>
        {!expanded && (
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
                {activeFiltersCount === 0 && (!showAllLocationsSwitch || !setShowAllLocation)
                  ? t('categories.location.list.nothing')
                  : t('categories.location.list.nothingFilter')}
              </EntryListPlaceholder>
            ) : (
              <EntryListPlaceholder>{t('categories.location.list.loading')}</EntryListPlaceholder>
            )}
          </EntryCardGrid>
        ) : (
          <StyledEntryListTable>
            <Table
              columns={[
                {
                  title: t('categories.location.form.name') as string,
                  bold: true,
                  width: 6,
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
                { title: t('categories.location.list.address') as string, width: 4 },
                { title: t('statusBar.status') as string, width: 4 },
                {
                  title: t('categories.organizer.table.updated') as string,
                  width: 4,
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
                  width: 4,
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
                    ? t('categories.location.list.nothing')
                    : t('categories.location.list.nothingFilter')
                  : t('categories.location.list.loading')
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
