import { useRouter } from 'next/router';
import { Table } from '../../../components/table';
import useSWR from 'swr';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories } from '../../../config/categories';
import { useApiCall, getApiUrlString } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Routes, routes } from '../../../config/routes';
import { useLocale } from '../../../lib/routing';
import { Locale } from '../../../config/locales';
import { CategoryPage } from '../../../lib/categories';

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OrganizerListPageProps extends CategoryPage {}

export const OrganizerListPage: React.FC<OrganizerListPageProps> = ({
  category,
}: OrganizerListPageProps) => {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  const apiCallFactory = category?.api.list.factory;
  const apiCallRoute = category?.api.list.route;

  const call = useApiCall();

  const { data } = useSWR(apiCallRoute ? getApiUrlString(apiCallRoute) : undefined, () =>
    category ? call(apiCallFactory) : undefined
  );

  const tableContent = useMemo(
    () =>
      data?.body?.data
        ? Object.values(data?.body?.data)
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
    [data, locale, router]
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
