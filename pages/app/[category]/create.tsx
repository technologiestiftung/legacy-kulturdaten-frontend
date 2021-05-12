import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { Categories, useCategories } from '../../../config/categories';
import { useT } from '../../../lib/i18n';

const EntryIndexPage: NextPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const t = useT();

  const category = router?.query?.category as Categories;
  const categoryStructure = categories[category];

  const categoryTitle = categoryStructure?.title.singular;

  return (
    <AppWrapper
      titleBar={<TitleBar title={`${t('general.create')} ${categoryTitle ? categoryTitle : ''}`} />}
    >
      Create
    </AppWrapper>
  );
};

export default EntryIndexPage;
