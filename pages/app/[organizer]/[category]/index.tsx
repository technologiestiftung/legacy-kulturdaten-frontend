import { NextPage } from 'next';
import React from 'react';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';
import { useCategory } from '../../../../lib/categories';

const EntryListPage: NextPage = () => {
  const category = useCategory();

  if (category) {
    return React.createElement(category.pages.list, { category });
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default EntryListPage;
