import { NextPage } from 'next';
import { LocaleSwitch } from '../../components/navigation/LocaleSwitch';

import { AppWrapper } from '../../components/wrappers/AppWrapper';

const SettingsPage: NextPage = () => {
  return (
    <AppWrapper>
      <div>TBD</div>
      <div>
        <LocaleSwitch />
      </div>
    </AppWrapper>
  );
};

export default SettingsPage;
