import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { AppWrapper } from '../../components/wrappers/AppWrapper';
import { useCategories } from '../../config/categories';
import { OrganizerTeamPage } from '../../components/pages/organizer/team';

const TeamPage: NextPage = () => {
  const router = useRouter();
  const categories = useCategories();
  const category = categories?.organizer;

  if (category) {
    return (
      <AppWrapper subMenuKey={category.subMenuKey}>
        <OrganizerTeamPage category={category} query={router?.query} />
      </AppWrapper>
    );
  }

  return <AppWrapper>TBD</AppWrapper>;
};

export default TeamPage;
