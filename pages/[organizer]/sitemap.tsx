import { NextPage } from 'next';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { routes, useLanguage, useLocale } from '../../lib/routing';
import { useUser } from '../../components/user/useUser';
import { AppWrapper } from '../../components/wrappers/AppWrapper';
import { useT } from '../../lib/i18n';
import { useOrganizer, useOrganizerId } from '../../lib/useOrganizer';
import { ContentContainer, ContentWrapper } from '../../components/wrappers/ContentWrappers';
import { DashbaordGreeting, DashboardWrapper } from '../../components/Dasboard';
import { defaultOrganizerId } from '../../components/navigation/NavigationContext';
import { useCategories } from '../../config/categories';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { SitemapContainer } from '../../components/pages/sitemap/wrapper';


const SitemapPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const language = useLanguage();
  const t = useT();
  const organizerId = useOrganizerId();
  const organizer = useOrganizer();
  const router = useRouter();
  const categories = useCategories();
  const userHasNoOrganizer = useMemo(() => organizerId === defaultOrganizerId, [organizerId]);
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);

  // const offers = useList<OfferList, Offer>(
  //   categories.offer,
  //   1,
  //   isUltraOrWider ? 3 : 2,
  //   [['organizers', organizerId]],
  //   undefined,
  //   true,
  //   undefined,
  //   ['locations']
  // );

  // const isPublished = useMemo(
  //   () => organizer?.data?.attributes?.status === PublishedStatus.published,
  //   [organizer?.data?.attributes?.status]
  // );

  // const currentTranslation = useMemo(
  //   () => getTranslation(language, organizer?.data?.relations?.translations, true),
  //   [language, organizer?.data?.relations?.translations]
  // );

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
      <DashboardWrapper>
        <ContentWrapper>
          <ContentContainer>
            <SitemapContainer organizer={organizer} organizerId={organizerId}/>
          </ContentContainer>
        </ContentWrapper>
      </DashboardWrapper>
    </AppWrapper>
  );
};

export default SitemapPage;
