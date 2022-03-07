import { NextPage } from 'next';

import { routes, useLocale } from '../lib/routing';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';
import { useOrganizerId } from '../lib/useOrganizer';
import { defaultOrganizerId } from '../components/navigation/NavigationContext';

const AppIndexPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const router = useRouter();

  console.log('replace route because index page');
  router.replace(
    routes.dashboard({ locale, query: { organizer: organizerId || defaultOrganizerId } })
  );

  return null;
};

export default AppIndexPage;
