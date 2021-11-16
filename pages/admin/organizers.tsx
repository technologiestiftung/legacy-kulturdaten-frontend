import { NextPage } from 'next';
import { AdminOrganizersPage } from '../../components/pages/admin/organizers';

import { AppWrapper } from '../../components/wrappers/AppWrapper';

const OrganizersPage: NextPage = () => {
  return (
    <AppWrapper>
      <AdminOrganizersPage />
    </AppWrapper>
  );
};

export default OrganizersPage;
