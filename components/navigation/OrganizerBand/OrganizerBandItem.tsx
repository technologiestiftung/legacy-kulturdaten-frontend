import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as feather from 'react-feather';
import Image from 'next/image';
import React, { RefObject, useMemo, useRef } from 'react';
import { OrganizerBandLayout } from '.';
import { Media } from '../../../lib/api/types/media';
import { MouseTooltip } from '../../MouseTooltip';

const StyledOrganizerBandItemLogo = styled.div<{
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder: boolean;
}>`
  border-radius: calc(0.75rem - 1px);
  width: 100%;

  flex-grow: 0;
  flex-shrink: 0;
  height: calc(3rem - 2px);
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-duration-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ layout, active, noBorder }) =>
    layout === OrganizerBandLayout.wide &&
    css`
      width: calc(3rem - 1px);
      border-radius: calc(0.75rem - 1px) 0 0 calc(0.75rem - 1px);
      border-right: 1px solid
        ${noBorder ? 'transparent' : active ? 'var(--black)' : 'var(--grey-400)'};
    `}

  > svg {
    display: block;
  }
`;

const StyledOrganizerBandItem = styled.a<{
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder?: boolean;
  adminModeActive?: boolean;
}>`
  text-decoration: none;
  width: 100%;
  display: block;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 0.75rem;
  background: ${({ adminModeActive }) =>
    adminModeActive ? 'rgba(255,255,255,0.25)' : 'var(--grey-200)'};
  border-radius: 0.75rem;
  padding: 0;
  margin: 0;
  appearance: none;
  color: ${({ adminModeActive }) => (adminModeActive ? 'var(--white)' : 'var(--grey-600)')};
  transition: background var(--transition-duration-fast), color var(--transition-duration-fast),
    border-color var(--transition-duration-fast), box-shadow var(--transition-duration-fast);

  ${({ layout }) =>
    layout === OrganizerBandLayout.wide &&
    css`
      justify-content: flex-start;
    `}

  ${({ noBorder, active }) =>
    noBorder
      ? css`
          border: 1px solid transparent;

          &:hover {
            background: var(--white);
            color: var(--grey-600);
          }

          ${active &&
          css`
            background: var(--white);
            color: var(--grey-600);
          `}
        `
      : css`
          border: 1px solid var(--grey-400);

          &:hover {
            box-shadow: var(--shadow-sharp-hover);
            border-color: var(--grey-600);
            color: var(--grey-600);

            ${StyledOrganizerBandItemLogo} {
              border-color: var(--grey-600);
            }
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

              ${StyledOrganizerBandItemLogo} {
                border-color: var(--black);
              }
            }
          `}
        `}
`;

const StyledOrganizerBandItemText = styled.div<{
  layout: OrganizerBandLayout;
}>`
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
  text-align: center;
  padding: calc(0.75rem - 1px) 0;

  ${({ layout }) =>
    layout === OrganizerBandLayout.wide &&
    css`
      padding: calc(0.75rem - 1px) 0.75rem calc(0.75rem - 1px) 0;
      text-align: left;
      font-size: var(--font-size-300);
      line-height: var(--line-height-300);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      justify-content: flex-start;
    `}
`;

interface OrganizerBandItemProps {
  children: string;
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder?: boolean;
  icon?: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  logo?: Media['data'];
  asButton?: boolean;
  adminModeActive?: boolean;
}

const OrganizerBandItemForwarded = (
  {
    children,
    active,
    href,
    onClick,
    layout,
    icon,
    noBorder,
    logo,
    asButton,
    adminModeActive,
  }: OrganizerBandItemProps,
  ref: RefObject<HTMLAnchorElement>
) => {
  const selfRef = useRef<HTMLDivElement>(null);
  const logoRenditions = useMemo<Media['data']['relations']['renditions']>(
    () => logo?.relations?.renditions?.filter((rendition) => rendition.attributes.base === 96),
    [logo?.relations?.renditions]
  );

  const logoRendition = useMemo(
    () =>
      logoRenditions?.length > 0
        ? logoRenditions[0]?.attributes
        : logo
        ? logo.attributes
        : undefined,
    [logoRenditions, logo]
  );

  return (
    <div ref={selfRef}>
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
        as={asButton ? 'button' : undefined}
        adminModeActive={adminModeActive}
      >
        <StyledOrganizerBandItemLogo active={active} layout={layout} noBorder={noBorder}>
          {icon && feather[icon] ? (
            React.createElement(feather[icon])
          ) : logoRendition ? (
            <Image src={logoRendition.url} layout={'fill'} objectFit="contain" />
          ) : (
            <StyledOrganizerBandItemText layout={OrganizerBandLayout.narrow}>
              {children?.slice(0, 1)}
            </StyledOrganizerBandItemText>
          )}
        </StyledOrganizerBandItemLogo>

        {layout === OrganizerBandLayout.narrow ? (
          <MouseTooltip hoverElement={selfRef}>{children}</MouseTooltip>
        ) : (
          <StyledOrganizerBandItemText layout={layout}>{children}</StyledOrganizerBandItemText>
        )}
      </StyledOrganizerBandItem>
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const OrganizerBandItem: React.FC<OrganizerBandItemProps> = React.forwardRef<
  HTMLAnchorElement,
  OrganizerBandItemProps
>(OrganizerBandItemForwarded);
