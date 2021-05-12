import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Table } from '../../../components/table';
import useSWR from 'swr';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories, useCategories } from '../../../config/categories';
import { useApiCall, getApiUrlString } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Routes, routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';
import { Locale } from '../../../config/locales';

interface EntryLinkProps {
  category: Categories;
  title: string;
  id: string;
  locale: Locale;
}

const EntryLink: React.FC<EntryLinkProps> = ({ category, title, id, locale }: EntryLinkProps) => (
  <Link href={routes[(category as string) as Routes]({ locale, query: { entry: id } })}>
    <a>{title}</a>
  </Link>
);

const CategoryListPage: NextPage = () => {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  const categories = useCategories();
  const categoryStructure = categories[router?.query?.category as Categories];
  const apiCallFactory = categoryStructure?.api.list.factory;
  const apiCallRoute = categoryStructure?.api.list.route;

  const call = useApiCall();

  const { data } = useSWR(apiCallRoute ? getApiUrlString(apiCallRoute) : undefined, () =>
    categoryStructure ? call(apiCallFactory) : undefined
  );

  const tableContent = useMemo(
    () =>
      data?.body?.data
        ? Object.values(data?.body?.data).map(({ attributes, id }, index) => [
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
    [data, locale, router]
  );

  if (categoryStructure) {
    const { title } = categoryStructure;
    return (
      <AppWrapper titleBar={<TitleBar title={title.plural} />}>
        <Table
          columns={[
            { title: t('labels.name') as string, bold: true },
            { title: t('labels.city') as string },
            { title: t('labels.created') as string },
            { title: t('labels.updated') as string },
          ]}
          content={tableContent}
        />
      </AppWrapper>
    );
  }

  const title = router?.query?.category
    ? (t(`categories.${router?.query?.category?.toString()}.title.plural`) as string)
    : undefined;

  return <AppWrapper titleBar={<TitleBar title={title} />}>TBD</AppWrapper>;
};

export default CategoryListPage;
