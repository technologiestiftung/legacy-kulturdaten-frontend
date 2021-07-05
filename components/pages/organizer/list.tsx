import { useRouter } from 'next/router';
import { Table, TableProps } from '../../../components/table';
import { TitleBar, TitleBarProps } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { ApiCall, OrganizerList } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useContext, useMemo, useState } from 'react';
import { Routes, routes } from '../../../config/routes';
import { useLanguage, useLocale } from '../../../lib/routing';
import { Category, CategoryEntry, CategoryPage, useList } from '../../../lib/categories';
import { Organizer, OrganizerTranslation } from '../../../lib/api/types/organizer';
import { MenuIcon } from '../../navigation/Menu/MenuIcon';
import { TableLink, StyledTableLinkText } from '../../table/TableLink';
import { getTranslation } from '../../../lib/translations';
import { useCategories } from '../../../config/categories';
import { NavigationContext } from '../../navigation/NavigationContext';
import { Button } from '../../button';

export const useOrganizerMenu = (
  category: Category,
  list: Organizer['data'][]
): {
  titleBar: React.ReactElement<TitleBarProps>;
  content: React.ReactElement<TableProps>;
} => {
  const table = useOrganizerTable(category, true);

  const titleBar = (
    <TitleBar
      title={category?.title.plural}
      action={<MenuIcon type={category?.icon} />}
      secondary
      reversed
    />
  );

  return { titleBar, content: table };
};

interface ListLinkProps {
  children: React.ReactNode;
}

export const useOrganizerTable = (
  category: Category,
  narrow?: boolean
): React.ReactElement<TableProps> => {
  const [currentPage, setCurrentPage] = useState(1);
  const list = useList<OrganizerList, Organizer>(category, {
    page: String(currentPage),
    size: '10',
  });
  const router = useRouter();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const { setNavigationOpen } = useContext(NavigationContext);

  const lastPage = useMemo(() => list?.meta?.pages?.lastPage, [list?.meta?.pages?.lastPage]);

  const tableContent = useMemo(
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
      <div>
        <Button
          onClick={() => (currentPage > 1 ? setCurrentPage(currentPage - 1) : undefined)}
          disabled={currentPage === 1}
        >
          prev
        </Button>
        <Button
          onClick={() => (currentPage < lastPage ? setCurrentPage(currentPage + 1) : undefined)}
          disabled={currentPage === lastPage}
        >
          next
        </Button>
        <span>
          Page {currentPage} of {lastPage}
        </span>
      </div>
      <Table
        columns={[
          { title: t('general.name') as string, bold: true },
          { title: t('general.name') as string },
        ]}
        content={tableContent}
        narrow={narrow}
      />
    </div>
  );
};

export const OrganizerListPage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const table = useOrganizerTable(category);

  const { title } = category;
  const action = category.icon ? <MenuIcon type={category.icon} /> : undefined;

  return <AppWrapper>{table}</AppWrapper>;
};

export const OrganizerTable: React.FC<{ narrow?: boolean }> = ({ narrow }: { narrow: boolean }) => {
  const categories = useCategories();
  const table = useOrganizerTable(categories.organizer, narrow);

  return table;
};
