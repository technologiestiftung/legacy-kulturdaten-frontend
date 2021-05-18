import { useRouter } from 'next/router';
import { Table, TableProps } from '../../../components/table';
import { TitleBar, TitleBarProps } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories } from '../../../config/categories';
import { OrganizerList } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Routes, routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';
import { Locale } from '../../../config/locales';
import { Category, CategoryPage, useList } from '../../../lib/categories';
import { Organizer } from '../../../lib/api/types/organizer';
import { MenuIcon } from '../../navigation/mainMenu/MenuIcon';

interface EntryLinkProps {
  category: Categories;
  title: string;
  id: string;
  locale: Locale;
}

const EntryLink: React.FC<EntryLinkProps> = ({ category, title, id, locale }: EntryLinkProps) => (
  <Link href={routes[(category as string) as Routes]({ locale, query: { id, sub: 'overview' } })}>
    <a>{title}</a>
  </Link>
);

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
            .map(({ attributes, id }, index) => [
              <EntryLink
                key={index}
                category={router?.query?.category as Categories}
                title={attributes.name}
                locale={locale}
                id={id}
              />,
              attributes.address.city,
            ])
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

  return <AppWrapper titleBar={<TitleBar title={title.plural} />}>{table}</AppWrapper>;
};
