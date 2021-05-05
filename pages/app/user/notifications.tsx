import { NextPage } from 'next';
import { TitleBar } from '../../../components/navigation/TitleBar';

import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useT } from '../../../lib/i18n';

const NotificationsPage: NextPage = () => {
  const t = useT();

  return (
    <AppWrapper titleBar={<TitleBar title={t('menu.start.actions.notifications') as string} />}>
      TBD
    </AppWrapper>
  );
};

export default NotificationsPage;
