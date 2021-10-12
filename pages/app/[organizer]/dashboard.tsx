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
import { DashboardRow } from '../../../components/Dasboard/DashboardRow';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileTextP,
} from '../../../components/Dasboard/DashboardTile';
import {
  DashboardTileLink,
  DashboardTileLinkType,
} from '../../../components/Dasboard/DashboardTileLink';

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
        <ContentContainer>
          <DashboardRow title="Die Kulturdaten (weiter-)verwenden">
            <DashboardTile title="Daten Export">
              <DashboardTileText>
                <DashboardTileTextP>
                  Alle Daten, die du auf Kulturdaten.Berlin bereitstellst, kannst du auch wieder in
                  Standardformaten exportieren.
                </DashboardTileTextP>
                <DashboardTileTextP>
                  Dazu kannst du in den entsprechenden Listen oder Einträgen die Export-Funktion
                  nutzen.
                </DashboardTileTextP>
              </DashboardTileText>
            </DashboardTile>
            <DashboardTile
              title="API Nutzung für Entwickler:innen"
              link={
                <DashboardTileLink
                  href="http://kulturdaten.berlin"
                  type={DashboardTileLinkType.external}
                  title="Jetzt API Token erstellen"
                >
                  Jetzt API Token erstellen
                </DashboardTileLink>
              }
            >
              <DashboardTileText>
                <DashboardTileTextP>
                  Alle Daten, die auf Kulturdaten.Berlin bereitgestellt werden, können frei
                  verwendet werden.
                </DashboardTileTextP>
                <DashboardTileTextP>
                  Für die programmatische Nutzung benötigst du ein API Token, welches du in deinen
                  Einstellungen erstellen kannst.
                </DashboardTileTextP>
              </DashboardTileText>
            </DashboardTile>
          </DashboardRow>
        </ContentContainer>
      </ContentWrapper>
    </AppWrapper>
  );
};

export default DashboardPage;
