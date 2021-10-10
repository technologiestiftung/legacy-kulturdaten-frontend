import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCategories } from '../../../config/categories';
import { ApiCall, OrganizerList, useApiCall } from '../../../lib/api';
import { Organizer } from '../../../lib/api/types/organizer';
import { Order, useList } from '../../../lib/categories';
import { useLanguage, useLocale } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { routes } from '../../../config/routes';
import React from 'react';
import { useSetOrganizerId } from '../../../lib/useOrganizer';
import { useT } from '../../../lib/i18n';
import { OrganizerBandItem } from './OrganizerBandItem';
import { Language } from '../../../config/locale';
import { useLoadingScreen } from '../../Loading/LoadingScreen';

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
  const organizers = useList<OrganizerList, Organizer>(categories?.organizer, 1, 3, undefined, {
    key: 'updatedAt',
    order: Order.DESC,
  });
  const language = useLanguage();
  const locale = useLocale();
  const router = useRouter();
  const setOrganizerId = useSetOrganizerId();
  const t = useT();
  const call = useApiCall();
  const loadingScreen = useLoadingScreen();

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
              logo={organizer.relations?.logo}
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
      <OrganizerBandItem
        active={router?.asPath === routes.createOrganizer({ locale })}
        layout={layout}
        icon="Plus"
        noBorder
        asButton
        onClick={async () => {
          const category = categories.organizer;

          loadingScreen(
            t('menu.createOrganizer'),
            async () => {
              try {
                const resp = await call<ApiCall>(category.api.create.factory, {
                  entry: {
                    relations: {
                      translations: [{ language: Language.de, name: 'Neue Anbieter:inn' }],
                    },
                  },
                });

                if (resp.status === 200) {
                  const id = resp.body.data.id;

                  router.push(
                    category.routes.list({ locale, query: { sub: 'info', organizer: id } })
                  );

                  setOrganizerId(id);

                  return { success: true };
                }
              } catch (e) {
                console.error(e);
                return { success: false, error: t('general.serverProblem') };
              }
            },
            t('general.takeAFewSeconds')
          );
        }}
      >
        {t('menu.createOrganizer') as string}
      </OrganizerBandItem>
    </StyledOrganizerBand>
  );
};
