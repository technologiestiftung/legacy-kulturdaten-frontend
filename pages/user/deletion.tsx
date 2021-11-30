import { NextPage } from 'next';
import { UserDeletionPage } from '../../components/pages/user/deletion';

import { AppWrapper } from '../../components/wrappers/AppWrapper';

const DeletionPage: NextPage = () => {
  return (
    <AppWrapper>
      <UserDeletionPage />
    </AppWrapper>
  );
};

export default DeletionPage;
