import { NextPage } from 'next';

import { routes, useLocale } from '../lib/routing';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';
import { defaultOrganizerId, useOrganizerId } from '../lib/useOrganizer';

const AppIndexPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const router = useRouter();

  router.replace(
    routes.dashboard({ locale, query: { organizer: organizerId || defaultOrganizerId } })
  );

  return null;
};

export default AppIndexPage;
