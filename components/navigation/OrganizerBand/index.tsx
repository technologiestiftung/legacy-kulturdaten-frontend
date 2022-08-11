import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { routes } from '../../../config/routes';
import React, { useContext } from 'react';
import { useOrganizerId, useSetOrganizerId } from '../../../lib/useOrganizer';
import { useT } from '../../../lib/i18n';
import { OrganizerBandItem } from './OrganizerBandItem';
import { useUserOrganizerLists } from '../../user/useUser';
import { useCreateOrganizer } from '../../../lib/categories';
import { defaultLanguage } from '../../../config/locale';
import { useAdminMode } from '../../Admin/AdminContext';
import { mq } from '../../globals/Constants';
import { Breakpoint } from '../../../lib/WindowService';
import { StandardLink } from '../../StandardLink';
import { StandardLinkType } from '../../../lib/generalTypes';
import { EntryListContext } from '../../EntryList/EntryListContext';
import { mainContentRef, mainTitleLink } from '../../../config/categories';

const HiddenOrganizerTitle = styled.h1`
  position:absolute;
  left:-10000px;
`;

const StyledOrganizerBand = styled.ul<{ adminModeActive: boolean }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;

  ${({ adminModeActive }) => adminModeActive && css``}
`;

export const SkipLinkMainContent:React.FC = () => {
  const t = useT();

  const SkipLinkButton = styled.button`
    position: absolute;
    opacity: 0;
    z-index: 10;

    &:focus {
      opacity: 1;
    }
  `;

  const skipLinkHandler = () => {
    if(mainContentRef.current) {
      mainContentRef.current.focus()
    }
  }
  return (
    <SkipLinkButton onClick={skipLinkHandler}>{t('general.toMainContent') as string}</SkipLinkButton>
  )
}

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

const SitemapIcon: React.FC = () => {
  return(
    <svg width="36" height="36" viewBox="0 0 36 36" fill="black" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 24.75V11.25" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7.5" y="6.75" width="21" height="4.5" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 24L10.5 18.75H25.4807L30 24" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="15" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="27" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export enum OrganizerBandLayout {
  narrow = 'narrow',
  wide = 'wide',
}

export interface OrganizerBandProps {
  layout: OrganizerBandLayout;
  onClick?: React.MouseEventHandler;
}

export const OrganizerBand: React.FC<OrganizerBandProps> = ({ layout }: OrganizerBandProps) => {
  const language = useLanguage();
  const locale = useLocale();
  const router = useRouter();
  const activeOrganizerId = useOrganizerId();
  const setOrganizerId = useSetOrganizerId();
  const t = useT();
  const createOrganizer = useCreateOrganizer();
  const { adminModeActive, quit: quitAdminMode } = useAdminMode();
  const { reset } = useContext(EntryListContext);

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
      <li><HiddenOrganizerTitle >{t('menu.organizerBand.title')}</HiddenOrganizerTitle></li>
      {adminModeActive ? (
        <li>
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
        </li>
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
                key={index}
                asButton
                active={router?.query?.organizer === organizer.id}
                layout={layout}
                logo={organizer.relations?.logo}
                onClick={() => {
                  if (organizer.id !== activeOrganizerId)
                    setOrganizerId(organizer.id);
                    reset();

                    router.push(routes.dashboard({ locale, query: { organizer: organizer.id } }));
                    setTimeout(() => {
                      mainTitleLink.current.focus();
                    }, 300)
                    return { success: true };
                }}
              >
                {translation?.attributes?.name ||
                  defaultTranslation?.attributes?.name ||
                  (t('general.placeholderOrganizer') as string)}
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
              await createOrganizer()
            }}
          >
            {t('menu.organizerBand.create') as string}
          </OrganizerBandItem>
          <OrganizerBandItem
            active={router?.asPath === routes.createOrganizer({ locale })}
            layout={layout}
            icon="sitemap"
            asButton
            onClick={async () => {
              await createOrganizer()
            }}
          >
            Sitemap
          </OrganizerBandItem>
        </>
      )}
    </StyledOrganizerBand>
  );
};
