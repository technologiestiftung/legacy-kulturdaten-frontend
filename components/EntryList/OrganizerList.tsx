import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
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
import { Order, useList } from '../../lib/categories';
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

const EntryListSort = styled.div<{ expanded: boolean }>`
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
      : css`
          padding: 0 0.75rem;
          display: grid;
          row-gap: 0.75rem;

          > *:last-of-type {
            padding: 0.75rem 0 0;
          }
        `}
`;

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
    // setEntriesPerPage,
    sortKey,
    setSortKey,
    order,
    setOrder,
    filters,
    dispatchFilters,
    view,
    setView,
  } = useContext(EntryListContext);

  const pseudoUID = usePseudoUID();

  const list = useList<OrganizerListCall, Organizer>(
    categories.organizer,
    currentPage,
    entriesPerPage,
    Object.entries(filters),
    { key: sortKey, order }
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
            onChange={(e) => {
              setCurrentPage(1);
              dispatchFilters({
                type: FiltersActions.set,
                payload: { key: 'status', value: e.target.value },
              });
            }}
          >
            <option value={undefined}>{t('categories.organizer.filters.status.all')}</option>
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
            labelPosition={expanded ? SelectLabelPosition.left : SelectLabelPosition.top}
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
            labelPosition={expanded ? RadioSwitchLabelPosition.left : RadioSwitchLabelPosition.top}
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
        <EntryCardGrid expanded={expanded}>
          {cards && cards.length > 0 ? cards : <div>Loading...</div>}
        </EntryCardGrid>
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
