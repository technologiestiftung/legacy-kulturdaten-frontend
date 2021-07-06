import { NextPage } from 'next';
import React from 'react';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useCategory } from '../../../lib/categories';

const EntryIndexPage: NextPage = () => {
  const category = useCategory();

  if (category) {
    return React.createElement(category.pages.create, { category });
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default EntryIndexPage;
