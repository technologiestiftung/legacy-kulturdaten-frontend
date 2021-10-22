import { NextPage } from 'next';
import React from 'react';
import { AppWrapper } from '../components/wrappers/AppWrapper';
import { useCategories } from '../config/categories';

const CreateOrganizerPage: NextPage = () => {
  const categories = useCategories();
  const category = categories?.organizer;

  if (category) {
    return React.createElement(category.pages.create, { category });
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default CreateOrganizerPage;
