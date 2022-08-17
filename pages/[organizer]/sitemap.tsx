import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { routes, useLocale } from '../../lib/routing';
import { useUser } from '../../components/user/useUser';
import { AppWrapper } from '../../components/wrappers/AppWrapper';
import { ContentContainer, ContentWrapper } from '../../components/wrappers/ContentWrappers';
import { useOrganizerId } from '../../lib/useOrganizer';
import { DashboardWrapper } from '../../components/Dasboard';
import { SitemapContainer } from '../../components/pages/sitemap/wrapper';
import { defaultOrganizerId } from '../../components/navigation/NavigationContext';


const SitemapPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const organizerId = useOrganizerId();
  const router = useRouter();

  useEffect(() => {
    if (
      organizerId !== defaultOrganizerId &&
      router?.query?.organizer !== organizerId &&
      organizerId
    ) {
      router.replace(routes.sitemap({ locale, query: { organizer: organizerId } }));
    }
  }, [locale, organizerId, router]);

  return (
    <AppWrapper>
      <SitemapContainer/>
    </AppWrapper>
  );
};

export default SitemapPage;
