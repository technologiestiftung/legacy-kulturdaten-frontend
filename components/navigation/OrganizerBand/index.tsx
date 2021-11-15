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

const StyledOrganizerBand = styled.div<{ adminModeActive: boolean }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;

  ${({ adminModeActive }) => adminModeActive && css``}
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

  return (
    <StyledOrganizerBand adminModeActive={adminModeActive}>
      {adminModeActive ? (
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
      ) : (
        <>
          {[...organizerOwnerList, ...organizerContributorList]?.map((organizer, index) => {
            const translation = getTranslation(language, organizer.relations?.translations, true);
            const defaultTranslation = getTranslation(
              defaultLanguage,
              organizer.relations?.translations
            );

            return (
              <Link
                key={index}
                href={routes.dashboard({ locale, query: { organizer: organizer.id } })}
                passHref
              >
                <OrganizerBandItem
                  active={router?.query?.organizer === organizer.id}
                  layout={layout}
                  logo={organizer.relations?.logo}
                  onClick={(e) => {
                    setOrganizerId(organizer.id);

                    if (onClick) {
                      onClick(e);
                    }
                  }}
                >
                  {translation?.attributes?.name || defaultTranslation?.attributes?.name}
                </OrganizerBandItem>
              </Link>
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
                t('menu.createOrganizer'),
                async () => await createOrganizer(),
                t('general.takeAFewSeconds')
              );
            }}
          >
            {t('menu.createOrganizer') as string}
          </OrganizerBandItem>
        </>
      )}
    </StyledOrganizerBand>
  );
};
