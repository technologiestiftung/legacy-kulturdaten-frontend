import { NextPage } from 'next';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import React from 'react';
import { useCategory } from '../../../lib/categories';

const CategoryListPage: NextPage = () => {
  const category = useCategory();

  if (category) {
    return React.createElement(category.pages.list, { category });
  }

  const title = 'TBD';

  return <AppWrapper>TBD</AppWrapper>;
};

export default CategoryListPage;
