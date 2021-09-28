import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCategories } from '../../../config/categories';
import { OrganizerList } from '../../../lib/api';
import { Organizer } from '../../../lib/api/types/organizer';
import { useList } from '../../../lib/categories';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { routes } from '../../../config/routes';
import React from 'react';
import { useSetOrganizerId } from '../../../lib/useOrganizer';
import { useT } from '../../../lib/i18n';
import { OrganizerBandItem } from './OrganizerBandItem';

const StyledOrganizerBand = styled.div<{ layout: OrganizerBandLayout }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;
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
  const categories = useCategories();
  const organizers = useList<OrganizerList, Organizer>(categories?.organizer, 1, 3);
  const language = useLanguage();
  const locale = useLocale();
  const router = useRouter();
  const setOrganizerId = useSetOrganizerId();
  const t = useT();

  return (
    <StyledOrganizerBand layout={layout}>
      {organizers?.data?.map((organizer, index) => {
        const translation = getTranslation(language, organizer.relations?.translations);

        return (
          <Link
            key={index}
            href={routes.dashboard({ locale, query: { organizer: organizer.id } })}
            passHref
          >
            <OrganizerBandItem
              active={router?.query?.organizer === organizer.id}
              layout={layout}
              onClick={(e) => {
                setOrganizerId(organizer.id);

                if (onClick) {
                  onClick(e);
                }
              }}
            >
              {translation?.attributes?.name}
            </OrganizerBandItem>
          </Link>
        );
      })}
      <Link href={routes.createOrganizer({ locale })} passHref>
        <OrganizerBandItem
          active={router?.asPath === routes.createOrganizer({ locale })}
          layout={layout}
          icon="Plus"
          noBorder
        >
          {t('menu.createOrganizer') as string}
        </OrganizerBandItem>
      </Link>
    </StyledOrganizerBand>
  );
};
