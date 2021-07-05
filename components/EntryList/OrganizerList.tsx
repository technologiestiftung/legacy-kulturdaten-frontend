import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StyledEntryListBody } from '.';
import { useCategories } from '../../config/categories';
import { OrganizerList as OrganizerListCall } from '../../lib/api';
import { Organizer, OrganizerTranslation } from '../../lib/api/types/organizer';
import { useList } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { Routes, routes, useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { Button } from '../button';
import { NavigationContext } from '../navigation/NavigationContext';
import { Table } from '../table';
import { StyledTableLinkText, TableLink } from '../table/TableLink';
import { EntryListHead } from './EntryListHead';
import { EntryListPagination } from './EntryListPagination';

interface OrganizerListProps {
  expanded: boolean;
}

interface ListLinkProps {
  children: React.ReactNode;
}

const entriesPerPage = 10;

export const OrganizerList: React.FC<OrganizerListProps> = ({ expanded }: OrganizerListProps) => {
  const categories = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();

  const list = useList<OrganizerListCall, Organizer>(categories.organizer, {
    page: String(currentPage),
    size: String(entriesPerPage),
  });

  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setNavigationOpen } = useContext(NavigationContext);
  // const lastPage = useMemo(() => list?.meta?.pages?.lastPage, [list?.meta?.pages?.lastPage]);
  // const totalEntries = useMemo(() => list?.meta?.pages?.total, [list?.meta?.pages?.total]);

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

  const listContent = useMemo(
    () =>
      list?.data
        ? Object.values(list.data)
            .reverse()
            .map(({ attributes, relations, id }, index) => {
              const { translations } = relations;
              const currentTranslation = getTranslation<OrganizerTranslation>(
                language,
                translations
              );

              const href = (sub?: string) =>
                routes[Routes.organizer]({
                  locale,
                  query: { id, sub },
                });

              const ListLink: React.FC<ListLinkProps> = ({ children }: ListLinkProps) => (
                <TableLink
                  onClick={() => setNavigationOpen(false)}
                  href={href('info')}
                  isActive={router.asPath.includes(href())}
                  status={attributes?.status}
                >
                  {children}
                </TableLink>
              );

              return {
                contents: [
                  <StyledTableLinkText key={`${index}-1`} isActive={router.asPath.includes(href())}>
                    {currentTranslation?.attributes.name}
                  </StyledTableLinkText>,
                  relations?.types
                    ? relations?.types
                        .map((type) => type?.relations?.translations[0]?.attributes?.name)
                        .join(', ')
                    : '',
                ],
                Wrapper: ListLink,
              };
            })
        : [],
    [list, locale, language, router, setNavigationOpen]
  );

  return (
    <div>
      <EntryListHead
        title={t('categories.organizer.title.plural') as string}
        actions={[<div key={9}>nice</div>]}
        expanded={expanded}
        accentColor="var(--red)"
      >
        filters
      </EntryListHead>
      <StyledEntryListBody>
        <Table
          columns={[
            { title: t('general.name') as string, bold: true },
            { title: t('general.name') as string },
          ]}
          content={listContent}
          narrow={!expanded}
        />
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
