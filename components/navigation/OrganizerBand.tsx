import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useCategories } from '../../config/categories';
import { OrganizerList } from '../../lib/api';
import { Organizer } from '../../lib/api/types/organizer';
import { useList } from '../../lib/categories';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { routes } from '../../config/routes';
import React, { RefObject } from 'react';
import { useOrganizerId, useSetOrganizerId } from '../../lib/useOrganizer';

const StyledOrganizerBand = styled.div<{ layout: OrganizerBandLayout }>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;
`;

const StyledOrganizerBandItem = styled.a<{ active: boolean; layout: OrganizerBandLayout }>`
  text-decoration: none;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
  text-align: center;
  padding: calc(0.75rem - 1px) 0;
  background: var(--grey-200);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  color: var(--grey-600);

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
    `}

  &:hover {
    box-shadow: var(--shadow-sharp-hover);
    border-color: var(--grey-600);
  }

  ${({ active }) =>
    active &&
    css`
      background: var(--white);
      border-color: var(--black);
      color: var(--black);
      box-shadow: var(--shadow-sharp-active);

      &:hover {
        box-shadow: var(--shadow-sharp-active);
        border-color: var(--black);
    `}
`;

interface OrganizerBandItemProps {
  children: React.ReactNode;
  active: boolean;
  organizerId: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  layout: OrganizerBandLayout;
}

// eslint-disable-next-line react/display-name
const OrganizerBandItem: React.FC<OrganizerBandItemProps> = React.forwardRef<
  HTMLAnchorElement,
  OrganizerBandItemProps
>(
  (
    { children, active, href, onClick, organizerId, layout }: OrganizerBandItemProps,
    ref: RefObject<HTMLAnchorElement>
  ) => {
    const setOrganizerId = useSetOrganizerId();

    return (
      <StyledOrganizerBandItem
        active={active}
        ref={ref}
        href={href}
        layout={layout}
        onClick={(e) => {
          setOrganizerId(organizerId);

          if (onClick) {
            onClick(e);
          }
        }}
      >
        {children}
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
  const organizerId = useOrganizerId();

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
              organizerId={organizer.id}
              active={organizerId === organizer.id}
              layout={layout}
              onClick={onClick}
            >
              {layout === OrganizerBandLayout.narrow
                ? translation?.attributes?.name.slice(0, 1)
                : translation?.attributes?.name}
            </OrganizerBandItem>
          </Link>
        );
      })}
    </StyledOrganizerBand>
  );
};
