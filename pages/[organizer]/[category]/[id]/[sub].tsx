import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCategory } from '../../../../lib/categories';
import { AppWrapper } from '../../../../components/wrappers/AppWrapper';

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const category = useCategory();

  const subPath = router?.query.sub as string;

  if (category) {
    return (
      <AppWrapper subMenuKey={category.subMenuKey}>
        {React.createElement(category?.pages[subPath || 'info'] || category.pages['404'], {
          category,
          query: router?.query,
        })}
      </AppWrapper>
    );
  }

  return null;
};

export default EntrySubPage;
