import { useRouter } from 'next/router';
import { Table, TableProps } from '../../../components/table';
import { TitleBar, TitleBarProps } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { OrganizerList } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useMemo } from 'react';
import { Routes, routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';
import { Category, CategoryPage, useList } from '../../../lib/categories';
import { Organizer } from '../../../lib/api/types/organizer';
import { MenuIcon } from '../../navigation/mainMenu/MenuIcon';
import { TableLink, StyledTableLinkText } from '../../table/TableLink';

export const useOrganizerMenu = (
  category: Category,
  list: Organizer[]
): {
  titleBar: React.ReactElement<TitleBarProps>;
  content: React.ReactElement<TableProps>;
} => {
  const table = useOrganizerTable(list, true);

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
  list: Organizer[],
  narrow?: boolean
): React.ReactElement<TableProps> => {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();

  const tableContent = useMemo(
    () =>
      list
        ? Object.values(list)
            .reverse()
            .map(({ attributes, relations, id }, index) => {
              const href = (sub?: string) =>
                routes[(router?.query?.category as string) as Routes]({
                  locale,
                  query: { id, sub },
                });

              const ListLink: React.FC<ListLinkProps> = ({ children }: ListLinkProps) => (
                <TableLink href={href('overview')} isActive={router.asPath.includes(href())}>
                  {children}
                </TableLink>
              );

              return {
                contents: [
                  <StyledTableLinkText key={`${index}-1`} isActive={router.asPath.includes(href())}>
                    {attributes.name}
                  </StyledTableLinkText>,
                  relations?.address?.attributes?.city,
                ],
                Wrapper: ListLink,
              };
            })
        : [],
    [list, locale, router]
  );

  return (
    <Table
      columns={[
        { title: t('general.name') as string, bold: true },
        { title: t('general.city') as string },
      ]}
      content={tableContent}
      narrow={narrow}
    />
  );
};

export const OrganizerListPage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const list = useList<OrganizerList, Organizer[]>(category);
  const table = useOrganizerTable(list);

  const { title } = category;
  const action = category.icon ? <MenuIcon type={category.icon} /> : undefined;

  return (
    <AppWrapper titleBar={<TitleBar title={title.plural} action={action} />}>{table}</AppWrapper>
  );
};
