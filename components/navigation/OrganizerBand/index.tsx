import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { routes } from '../../../config/routes';
import React from 'react';
import { useSetOrganizerId } from '../../../lib/useOrganizer';
import { useT } from '../../../lib/i18n';
import { OrganizerBandItem } from './OrganizerBandItem';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { useUserOrganizerLists } from '../../user/useUser';
import { useCreateOrganizer } from '../../../lib/categories';
import { defaultLanguage } from '../../../config/locale';
import { useAdminMode } from '../../Admin/AdminContext';
import { mq } from '../../globals/Constants';
import { Breakpoint } from '../../../lib/WindowService';
import { StandardLink } from '../../StandardLink';
import { StandardLinkType } from '../../../lib/generalTypes';

const StyledOrganizerBand = styled.div<{ adminModeActive: boolean }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;

  ${({ adminModeActive }) => adminModeActive && css``}
`;

const StyledOrganizerBandAdminMark = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0;

  ${mq(Breakpoint.mid)} {
    order: 1000;
    padding: 1.125rem 0;
    justify-content: center;
  }
`;

const StyledOrganizerBandAdminMarkText = styled.div`
  color: var(--white);
  font-size: var(--font-size-500);
  line-height: var(--line-height-500);
  font-weight: 700;

  ${mq(Breakpoint.mid)} {
    writing-mode: vertical-rl;
    text-orientation: sideways;
    transform: rotate(180deg);
  }
`;

export enum OrganizerBandLayout {
  narrow = 'narrow',
  wide = 'wide',
}

export interface OrganizerBandProps {
  layout: OrganizerBandLayout;
  onClick?: React.MouseEventHandler;
}

export const OrganizerBand: React.FC<OrganizerBandProps> = ({
  layout,
  onClick,
}: OrganizerBandProps) => {
  const language = useLanguage();
  const locale = useLocale();
  const router = useRouter();
  const setOrganizerId = useSetOrganizerId();
  const t = useT();
  const loadingScreen = useLoadingScreen();
  const createOrganizer = useCreateOrganizer();
  const { adminModeActive, quit: quitAdminMode } = useAdminMode();

  const { owner: organizerOwnerList, contributor: organizerContributorList } =
    useUserOrganizerLists();

  const renderedAdminMark = (
    <StyledOrganizerBandAdminMark>
      <StyledOrganizerBandAdminMarkText>
        <StandardLink type={StandardLinkType.internal} href={routes.admin({ locale })}>
          Adminmodus
        </StandardLink>
      </StyledOrganizerBandAdminMarkText>
    </StyledOrganizerBandAdminMark>
  );

  return (
    <StyledOrganizerBand adminModeActive={adminModeActive}>
      {adminModeActive ? (
        <>
          {renderedAdminMark}
          <OrganizerBandItem
            active={router?.asPath === routes.createOrganizer({ locale })}
            layout={layout}
            icon="X"
            noBorder
            asButton
            onClick={() => quitAdminMode()}
            adminModeActive
          >
            {t('admin.leave') as string}
          </OrganizerBandItem>
        </>
      ) : (
        <>
          {[...organizerOwnerList, ...organizerContributorList]?.map((organizer, index) => {
            const translation = getTranslation(language, organizer.relations?.translations, true);
            const defaultTranslation = getTranslation(
              defaultLanguage,
              organizer.relations?.translations
            );

            return (
              <OrganizerBandItem
                asButton
                active={router?.query?.organizer === organizer.id}
                layout={layout}
                logo={organizer.relations?.logo}
                onClick={(e) => {
                  loadingScreen(t('menu.organizerBand.loading'), async () => {
                    setOrganizerId(organizer.id);

                    router.push(routes.dashboard({ locale, query: { organizer: organizer.id } }));

                    return { success: true };
                  });
                }}
              >
                {translation?.attributes?.name || defaultTranslation?.attributes?.name}
              </OrganizerBandItem>
            );
          })}
          <OrganizerBandItem
            active={router?.asPath === routes.createOrganizer({ locale })}
            layout={layout}
            icon="Plus"
            noBorder
            asButton
            onClick={async () => {
              loadingScreen(
                t('menu.organizerBand.create'),
                async () => await createOrganizer(),
                t('general.takeAFewSeconds')
              );
            }}
          >
            {t('menu.organizerBand.create') as string}
          </OrganizerBandItem>
        </>
      )}
    </StyledOrganizerBand>
  );
};
