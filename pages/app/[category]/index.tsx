import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useT } from '../../../lib/i18n';

const CategoryListPage: NextPage = () => {
  const router = useRouter();
  const t = useT();

  const title = router?.query?.category
    ? (t(`categories.${router?.query?.category?.toString()}.title.plural`) as string)
    : undefined;

  return <AppWrapper titleBar={<TitleBar title={title} />}>TBD</AppWrapper>;
};

export default CategoryListPage;
