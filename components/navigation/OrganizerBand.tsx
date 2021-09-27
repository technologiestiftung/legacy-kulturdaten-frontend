import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import * as feather from 'react-feather';
import { useCategories } from '../../config/categories';
import { OrganizerList } from '../../lib/api';
import { Organizer } from '../../lib/api/types/organizer';
import { useList } from '../../lib/categories';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { routes } from '../../config/routes';
import React, { RefObject } from 'react';
import { useSetOrganizerId } from '../../lib/useOrganizer';
import { useRouter } from 'next/router';
import { useT } from '../../lib/i18n';

const StyledOrganizerBand = styled.div<{ layout: OrganizerBandLayout }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;
`;

const StyledOrganizerBandItem = styled.a<{
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder?: boolean;
}>`
  text-decoration: none;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: calc(0.75rem - 1px) 0;
  background: var(--grey-200);
  border-radius: 0.75rem;
  color: var(--grey-600);
  transition: background var(--transition-duration-fast), color var(--transition-duration-fast),
    border-color var(--transition-duration-fast), box-shadow var(--transition-duration-fast);

  ${({ noBorder, active }) =>
    noBorder
      ? css`
          border: 1px solid transparent;

          &:hover {
            background: var(--white);
          }

          ${active &&
          css`
            background: var(--white);
          `}
        `
      : css`
          border: 1px solid var(--grey-400);

          &:hover {
            box-shadow: var(--shadow-sharp-hover);
            border-color: var(--grey-600);
          }

          ${active &&
          css`
            background: var(--white);
            border-color: var(--black);
            color: var(--black);
            box-shadow: var(--shadow-sharp-active);

            &:hover {
              box-shadow: var(--shadow-sharp-active);
              border-color: var(--black);
            }
          `}
        `}

  ${({ layout }) =>
    layout === OrganizerBandLayout.wide &&
    css`
      text-align: left;
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      padding: 0.75rem 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      justify-content: flex-start;
    `}

  > svg {
    display: block;
    padding-right: ${({ layout }) => (layout === OrganizerBandLayout.wide ? ' 0.375rem' : '0')};
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface OrganizerBandItemProps {
  children: string;
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder?: boolean;
  icon?: string;
  href?: string;
  onClick?: React.MouseEventHandler;
}

// eslint-disable-next-line react/display-name
const OrganizerBandItem: React.FC<OrganizerBandItemProps> = React.forwardRef<
  HTMLAnchorElement,
  OrganizerBandItemProps
>(
  (
    { children, active, href, onClick, layout, icon, noBorder }: OrganizerBandItemProps,
    ref: RefObject<HTMLAnchorElement>
  ) => {
    return (
      <StyledOrganizerBandItem
        active={active}
        ref={ref}
        href={href}
        layout={layout}
        aria-label={children as string}
        noBorder={noBorder}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {layout === OrganizerBandLayout.wide ? (
          <>
            {icon && feather[icon] && React.createElement(feather[icon])}
            <span>{children}</span>
          </>
        ) : icon && feather[icon] ? (
          React.createElement(feather[icon])
        ) : (
          children
        )}
      </StyledOrganizerBandItem>
    );
  }
);

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
              {layout === OrganizerBandLayout.narrow
                ? translation?.attributes?.name.slice(0, 1)
                : translation?.attributes?.name}
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
