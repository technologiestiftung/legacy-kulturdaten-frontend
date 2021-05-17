import { NextPage } from 'next';
import React from 'react';
import { TitleBar } from '../../../components/navigation/TitleBar';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useCategory } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';

const EntryIndexPage: NextPage = () => {
  const category = useCategory();
  const t = useT();

  if (category) {
    return React.createElement(category.pages.create, { category });
  }

  return <AppWrapper titleBar={<TitleBar title={`${t('general.create')}: TBD`} />}>TBD</AppWrapper>;
};

export default EntryIndexPage;
