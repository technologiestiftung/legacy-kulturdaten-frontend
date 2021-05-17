import { useRouter } from 'next/router';
import { Table } from '../../../components/table';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories } from '../../../config/categories';
import { OrganizerList } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Routes, routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';
import { Locale } from '../../../config/locales';
import { CategoryPage, useList } from '../../../lib/categories';
import { Organizer } from '../../../lib/api/types/organizer';

interface EntryLinkProps {
  category: Categories;
  title: string;
  id: string;
  locale: Locale;
}

const EntryLink: React.FC<EntryLinkProps> = ({ category, title, id, locale }: EntryLinkProps) => (
  <Link href={routes[(category as string) as Routes]({ locale, query: { id } })}>
    <a>{title}</a>
  </Link>
);

export const OrganizerListPage: React.FC<CategoryPage> = ({ category }: CategoryPage) => {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const list = useList<OrganizerList, Organizer[]>(category);

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
              attributes.createdAt,
              attributes.updatedAt,
            ])
        : [],
    [list, locale, router]
  );

  const { title } = category;
  return (
    <AppWrapper titleBar={<TitleBar title={title.plural} />}>
      <Table
        columns={[
          { title: t('general.name') as string, bold: true },
          { title: t('general.city') as string },
          { title: t('general.created') as string },
          { title: t('general.updated') as string },
        ]}
        content={tableContent}
      />
    </AppWrapper>
  );
};
