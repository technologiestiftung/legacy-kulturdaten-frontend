import { NextPage } from 'next';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import { routes, useLanguage, useLocale } from '../../lib/routing';
import { useUser } from '../../components/user/useUser';
import { AppWrapper } from '../../components/wrappers/AppWrapper';
import { useT } from '../../lib/i18n';
import { useOrganizerId } from '../../lib/useOrganizer';
import { ContentContainer, ContentWrapper } from '../../components/wrappers/ContentWrappers';
import { DashbaordGreeting, DashboardWrapper } from '../../components/Dasboard';
import { useRandomInt } from '../../lib/random';
import { DashboardRow } from '../../components/Dasboard/DashboardRow';
import {
  DashboardTile,
  DashboardTileText,
  DashboardTileTextP,
} from '../../components/Dasboard/DashboardTile';
import {
  DashboardTileButton,
  DashboardTileLink,
} from '../../components/Dasboard/DashboardTileLink';
import { StandardLinkType } from '../../lib/generalTypes';
import { DashboardLinkList } from '../../components/Dasboard/DashboardLinkList';
import {
  Order,
  useCreateLocation,
  useCreateOffer,
  useCreateOrganizer,
  useList,
  useOfferDateList,
} from '../../lib/categories';
import { Offer } from '../../lib/api/types/offer';
import { OfferList } from '../../lib/api';
import { useCategories } from '../../config/categories';
import { getTranslation } from '../../lib/translations';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { DateFormat, useDate } from '../../lib/date';
import { DateStatusFlag } from '../../components/DateList/DateStatusFlag';
import { useLoadingScreen } from '../../components/Loading/LoadingScreen';
import { defaultOrganizerId } from '../../components/navigation/NavigationContext';

const StyledDashboardTileDate = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface DashboardDateTileProps {
  offer: Offer['data'];
}

const DashboardOfferTile: React.FC<DashboardDateTileProps> = ({
  offer,
}: DashboardDateTileProps) => {
  const language = useLanguage();
  const t = useT();
  const organizerId = useOrganizerId();
  const locale = useLocale();
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);
  const formatDate = useDate();
  const currentTranslation = getTranslation(language, offer.relations?.translations, true);

  const { data: dates } = useOfferDateList(offer.id, 1, 4, [['past', 'false']], {
    key: 'startsAt',
    order: Order.ASC,
  });

  return (
    <DashboardTile
      title={currentTranslation?.attributes?.name}
      gridColumn={isUltraOrWider ? 'span 4' : undefined}
      link={
        <DashboardTileLink
          type={StandardLinkType.internal}
          href={routes.offer({
            locale,
            query: { id: offer.id, organizer: organizerId, sub: 'info' },
          })}
          title={t('dashboard.info.offers.link') as string}
        />
      }
    >
      <DashboardTileText>
        {dates?.map((date, datesIndex) => {
          return (
            <StyledDashboardTileDate key={datesIndex}>
              <DashboardTileTextP>
                {date.attributes.startsAt
                  ? formatDate(new Date(date.attributes.startsAt), DateFormat.dayDateTime)
                  : ''}
              </DashboardTileTextP>
              <DateStatusFlag status={date.attributes.status} />
            </StyledDashboardTileDate>
          );
        })}
        {!dates || dates.length === 0 ? (
          <DashboardTileTextP>{t('dashboard.info.offers.datePlaceholder')}</DashboardTileTextP>
        ) : (
          ''
        )}
      </DashboardTileText>
    </DashboardTile>
  );
};

const DashboardStartTileRow: React.FC = () => {
  const t = useT();
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);
  const createOrganizer = useCreateOrganizer();
  const createOffer = useCreateOffer();
  const createLocation = useCreateLocation();
  const loadingScreen = useLoadingScreen();
  const organizerId = useOrganizerId();
  const categories = useCategories();

  const offers = useList<OfferList, Offer>(
    categories.offer,
    1,
    1,
    [['organizers', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const locations = useList<OfferList, Offer>(
    categories.location,
    1,
    1,
    [['organizer', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const hasOffers = useMemo(() => offers?.data?.length > 0, [offers]);
  const hasLocations = useMemo(() => locations?.data?.length > 0, [locations]);

  const tileSpan = isUltraOrWider ? 'span 4' : undefined;

  return (
    (!hasOffers || !hasLocations) && (
      <DashboardRow title={t('dashboard.info.start.title') as string}>
        <DashboardTile
          title={t('dashboard.info.start.organizer.title') as string}
          gridColumn={tileSpan}
          digit={1}
          done={
            organizerId !== defaultOrganizerId
              ? {
                  text: t('dashboard.info.start.organizer.done') as string,
                }
              : undefined
          }
          link={
            <DashboardTileButton
              title={t('dashboard.info.start.organizer.button') as string}
              onClick={() => {
                loadingScreen(
                  t('categories.organizer.form.create'),
                  async () => {
                    const resp = await createOrganizer();
                    return resp;
                  },
                  t('general.takeAFewSeconds')
                );
              }}
            />
          }
        >
          {t('dashboard.info.start.organizer.content')}
        </DashboardTile>
        <DashboardTile
          title={t('dashboard.info.start.location.title') as string}
          gridColumn={tileSpan}
          digit={2}
          disabled={organizerId === defaultOrganizerId}
          done={
            organizerId !== defaultOrganizerId && hasLocations
              ? {
                  text: t('dashboard.info.start.location.done') as string,
                }
              : undefined
          }
          link={
            <DashboardTileButton
              title={t('dashboard.info.start.location.button') as string}
              disabled={organizerId === defaultOrganizerId}
              onClick={() => {
                loadingScreen(
                  t('categories.location.form.create'),
                  async () => {
                    const resp = await createLocation();
                    return resp;
                  },
                  t('general.takeAFewSeconds')
                );
              }}
            />
          }
        >
          {t('dashboard.info.start.location.content')}
        </DashboardTile>
        <DashboardTile
          title={t('dashboard.info.start.offer.title') as string}
          gridColumn={tileSpan}
          digit={3}
          disabled={organizerId === defaultOrganizerId}
          done={
            organizerId !== defaultOrganizerId && hasOffers
              ? {
                  text: t('dashboard.info.start.offer.done') as string,
                }
              : undefined
          }
          link={
            <DashboardTileButton
              title={t('dashboard.info.start.offer.button') as string}
              disabled={organizerId === defaultOrganizerId}
              onClick={() => {
                loadingScreen(
                  t('categories.offer.form.create'),
                  async () => {
                    const resp = await createOffer();
                    return resp;
                  },
                  t('general.takeAFewSeconds')
                );
              }}
            />
          }
        >
          {t('dashboard.info.start.offer.content')}
        </DashboardTile>
      </DashboardRow>
    )
  );
};

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
  const categories = useCategories();
  const userHasNoOrganizer = useMemo(() => organizerId === defaultOrganizerId, [organizerId]);
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);

  const selectedGreetings = useMemo(
    () => (userHasNoOrganizer ? greetings.initial : greetings.default),
    [userHasNoOrganizer]
  );

  const randomGreetingsIndex = useRandomInt(0, selectedGreetings.length);
  const offers = useList<OfferList, Offer>(categories.offer, 1, isUltraOrWider ? 3 : 2, [
    ['organizers', organizerId],
  ]);

  useEffect(() => {
    if (
      organizerId !== defaultOrganizerId &&
      router?.query?.organizer !== organizerId &&
      organizerId
    ) {
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
            {organizerId !== defaultOrganizerId && offers?.data?.length > 0 && (
              <DashboardRow title={t('dashboard.info.offers.title') as string}>
                {offers?.data?.map((offer, index) => (
                  <DashboardOfferTile offer={offer} key={index} />
                ))}
              </DashboardRow>
            )}
            {organizerId !== defaultOrganizerId && (
              <DashboardRow title={t('dashboard.info.organizer.title') as string}>
                <DashboardTile
                  title={t('dashboard.info.organizer.team.title') as string}
                  link={
                    <DashboardTileLink
                      href={routes.team({ locale, query: { organizer: organizerId } })}
                      type={StandardLinkType.internal}
                      title={t('dashboard.info.organizer.team.link') as string}
                    />
                  }
                >
                  {t('dashboard.info.organizer.team.content')}
                </DashboardTile>
                <DashboardTile
                  title={t('dashboard.info.organizer.profile.title') as string}
                  link={
                    <DashboardTileLink
                      href={routes.organizer({
                        locale,
                        query: { organizer: organizerId, sub: 'info' },
                      })}
                      type={StandardLinkType.internal}
                      title={t('dashboard.info.organizer.profile.link') as string}
                    />
                  }
                >
                  {t('dashboard.info.organizer.profile.content')}
                </DashboardTile>
              </DashboardRow>
            )}
            <DashboardStartTileRow />
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
