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

const StyledOrganizerBand = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 0.75rem;
`;

const StyledOrganizerBandItem = styled.a<{ active: boolean }>`
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
}

// eslint-disable-next-line react/display-name
const OrganizerBandItem: React.FC<OrganizerBandItemProps> = React.forwardRef<
  HTMLAnchorElement,
  OrganizerBandItemProps
>(
  (
    { children, active, href, onClick, organizerId }: OrganizerBandItemProps,
    ref: RefObject<HTMLAnchorElement>
  ) => {
    const setOrganizerId = useSetOrganizerId();

    return (
      <StyledOrganizerBandItem
        active={active}
        ref={ref}
        href={href}
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

export const OrganizerBand: React.FC = () => {
  const categories = useCategories();
  const organizers = useList<OrganizerList, Organizer>(categories?.organizer, 1, 3);
  const language = useLanguage();
  const locale = useLocale();
  const organizerId = useOrganizerId();

  return (
    <StyledOrganizerBand>
      {organizers?.data?.map((organizer, index) => {
        const translation = getTranslation(language, organizer.relations?.translations);

        return (
          <Link
            key={index}
            href={routes.dashboard({ locale, query: { organizer: organizer.id } })}
            passHref
          >
            <OrganizerBandItem organizerId={organizer.id} active={organizerId === organizer.id}>
              {translation?.attributes?.name.slice(0, 1)}
            </OrganizerBandItem>
          </Link>
        );
      })}
    </StyledOrganizerBand>
  );
};
