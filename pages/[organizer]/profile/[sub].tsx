import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useCategories } from '../../../config/categories';

const EntrySubPage: NextPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const category = categories?.organizer;

  const subPath = router?.query.sub as string;

  if (category) {
    return (
      <AppWrapper subMenuKey={category.subMenuKey}>
        {React.createElement(category?.pages[subPath || 'info'], {
          category,
          query: router?.query,
        })}
      </AppWrapper>
    );
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default EntrySubPage;
