import { NextPage } from 'next';

import { routes, useLocale } from '../../../lib/routing';
import { useUser } from '../../../components/user/useUser';
import { AppWrapper } from '../../../components/wrappers/AppWrapper';
import { useT } from '../../../lib/i18n';
import { defaultOrganizerId, useOrganizerId } from '../../../lib/useOrganizer';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ContentContainer, ContentWrapper } from '../../../components/wrappers/ContentWrappers';
import { DashbaordGreeting, DashboardWrapper } from '../../../components/Dasboard';
import { useRandomInt } from '../../../lib/random';
import { DashboardRow } from '../../../components/Dasboard/DashboardRow';
import { DashboardTile } from '../../../components/Dasboard/DashboardTile';
import { DashboardTileLink } from '../../../components/Dasboard/DashboardTileLink';
import { StandardLinkType } from '../../../lib/generalTypes';
import { DashboardLinkList } from '../../../components/Dasboard/DashboardLinkList';

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
      <DashboardWrapper>
        <ContentWrapper>
          <ContentContainer>
            <DashbaordGreeting>{t(selectedGreetings[randomGreetingsIndex])}</DashbaordGreeting>
          </ContentContainer>
          <ContentContainer>
            <DashboardRow title={t('dashboard.info.data.title') as string}>
              <DashboardTile title={t('dashboard.info.data.export.title') as string}>
                {t('dashboard.info.data.export.content')}
              </DashboardTile>
              <DashboardTile
                title={t('dashboard.info.data.api.title') as string}
                link={
                  <DashboardTileLink
                    href={routes.userSettings({ locale })}
                    type={StandardLinkType.internal}
                    title={t('dashboard.info.data.api.link') as string}
                  />
                }
              >
                {t('dashboard.info.data.api.content')}
              </DashboardTile>
            </DashboardRow>
            <DashboardRow>
              <DashboardLinkList
                title={t('dashboard.info.linkList.help.title') as string}
                text={<p>{t('dashboard.info.linkList.help.text') as string}</p>}
                links={[
                  {
                    title: t('dashboard.info.linkList.help.links.1.title') as string,
                    href: t('dashboard.info.linkList.help.links.1.href') as string,
                    type: StandardLinkType.external,
                  },
                  {
                    title: t('dashboard.info.linkList.help.links.2.title') as string,
                    href: t('dashboard.info.linkList.help.links.2.href') as string,
                    type: StandardLinkType.external,
                  },
                ]}
              />
              <DashboardLinkList
                title={t('dashboard.info.linkList.openSource.title') as string}
                text={<p>{t('dashboard.info.linkList.openSource.text') as string}</p>}
                links={[
                  {
                    title: t('dashboard.info.linkList.openSource.links.1.title') as string,
                    href: t('dashboard.info.linkList.openSource.links.1.href') as string,
                    type: StandardLinkType.external,
                  },
                  {
                    title: t('dashboard.info.linkList.openSource.links.2.title') as string,
                    href: t('dashboard.info.linkList.openSource.links.2.href') as string,
                    type: StandardLinkType.external,
                  },
                ]}
              />
              <DashboardLinkList
                title={t('dashboard.info.linkList.contact.title') as string}
                text={<p>{t('dashboard.info.linkList.contact.text') as string}</p>}
                links={[
                  {
                    title: t('dashboard.info.linkList.contact.links.1.title') as string,
                    href: t('dashboard.info.linkList.contact.links.1.href') as string,
                    type: StandardLinkType.external,
                  },
                ]}
              />
            </DashboardRow>
          </ContentContainer>
        </ContentWrapper>
      </DashboardWrapper>
    </AppWrapper>
  );
};

export default DashboardPage;
