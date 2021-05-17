import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCategory } from '../../../../lib/categories';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { TitleBar } from '../../../../components/navigation/TitleBar';

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();

  const subPath = router?.query.sub as string;

  if (category && category.pages[subPath]) {
    return React.createElement(category?.pages[subPath], { category, query: router?.query });
  }

  const title = 'TBD';

  return <AppWrapper titleBar={<TitleBar title={title} />}>TBD</AppWrapper>;
};

export default EntrySubPage;
