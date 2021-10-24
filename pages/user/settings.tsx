import { NextPage } from 'next';
import { UserSettingsPage } from '../../components/pages/user/settings';

import { AppWrapper } from '../../components/wrappers/AppWrapper';

const SettingsPage: NextPage = () => {
  return (
    <AppWrapper>
      <UserSettingsPage />
    </AppWrapper>
  );
};

export default SettingsPage;
