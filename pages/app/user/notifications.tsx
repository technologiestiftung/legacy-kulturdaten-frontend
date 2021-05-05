import { NextPage } from 'next';
import { TitleBar } from '../../../components/navigation/TitleBar';

import { AppWrapper } from '../../../components/wrappers/AppWrapper';

const NotificationsPage: NextPage = () => (
  <AppWrapper titleBar={<TitleBar title="User Notifications" />}>User Notifications</AppWrapper>
);

export default NotificationsPage;
