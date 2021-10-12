import { NextPage } from 'next';

import { routes, useLocale } from '../../../lib/routing';
import { useUser } from '../../../components/user/useUser';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useT } from '../../../lib/i18n';
import { defaultOrganizerId, useOrganizerId } from '../../../lib/useOrganizer';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ContentContainer, ContentWrapper } from '../../../components/wrappers/ContentWrappers';
import { DashbaordGreeting } from '../../../components/Dasboard';
import { useRandomInt } from '../../../lib/random';

const greetings: {
  [key: string]: string[];
} = {
  initial: ['greetings.welcome'],
  default: ['greetings.hey', 'greetings.hello', 'greetings.heyhey'],
};

const DashboardPage: NextPage = () => {
  useUser();
  const locale = useLocale();
  const t = useT();
  const organizerId = useOrganizerId();
  const router = useRouter();

  const userHasNoOrganizer = useMemo(() => organizerId === defaultOrganizerId, [organizerId]);

  const selectedGreetings = useMemo(
    () => (userHasNoOrganizer ? greetings.initial : greetings.default),
    [userHasNoOrganizer]
  );

  const randomGreetingsIndex = useRandomInt(0, selectedGreetings.length);

  useEffect(() => {
    if (organizerId !== defaultOrganizerId && router?.query?.organizer !== organizerId) {
      router.replace(routes.dashboard({ locale, query: { organizer: organizerId } }));
    }
  }, [locale, organizerId, router]);

  return (
    <AppWrapper>
      <ContentWrapper>
        <ContentContainer>
          <DashbaordGreeting>{t(selectedGreetings[randomGreetingsIndex])}</DashbaordGreeting>
        </ContentContainer>
      </ContentWrapper>
    </AppWrapper>
  );
};

export default DashboardPage;
