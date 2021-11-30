import { NextPage } from 'next';
import { UserDeveloperPage } from '../../components/pages/user/developer';

import { AppWrapper } from '../../components/wrappers/AppWrapper';

const DeveloperPage: NextPage = () => {
  return (
    <AppWrapper>
      <UserDeveloperPage />
    </AppWrapper>
  );
};

export default DeveloperPage;
