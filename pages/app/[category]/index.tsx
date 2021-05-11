import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Table } from '../../../components/table';
import useSWR from 'swr';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories, useCategories } from '../../../config/categories';
import { useApiCall, getApiUrlString } from '../../../lib/api';
import { useT } from '../../../lib/i18n';
import { useMemo } from 'react';

const CategoryListPage: NextPage = () => {
  const router = useRouter();
  const t = useT();

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
        ? Object.values(data?.body?.data).map(({ attributes }) => [
            attributes.name,
            attributes.address.city,
            attributes.createdAt,
            attributes.updatedAt,
          ])
        : [],
    [data]
  );

  if (categoryStructure) {
    const { title } = categoryStructure;
    return (
      <AppWrapper titleBar={<TitleBar title={title.plural} />}>
        <Table
          columns={[
            { title: 'Bezeichnung', bold: true },
            { title: 'Stadt' },
            { title: 'Erstellt' },
            { title: 'Geändert' },
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
