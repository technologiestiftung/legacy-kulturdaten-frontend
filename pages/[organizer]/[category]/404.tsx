import React from 'react';
import { NextPage } from 'next';
import { useCategory } from '../../../lib/categories';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';

const EntrySubPage: NextPage = () => {
  const category = useCategory();

  if (category) {
    return <AppWrapper subMenuKey={category.subMenuKey}>404</AppWrapper>;
  }

  return null;
};

export default EntrySubPage;
