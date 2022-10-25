import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as feather from 'react-feather';
import Image from 'next/image';
import React, { RefObject, useMemo, useRef, useState } from 'react';
import { OrganizerBandLayout } from '.';
import { Media } from '../../../lib/api/types/media';
import { MouseTooltip } from '../../MouseTooltip';
import { focusStyles } from '../../globals/Constants'

const StyledOrganizerBandItemLogo = styled.span<{
  active: boolean;
  layout: OrganizerBandLayout;
  noBorder: boolean;
}>`
  border-radius: calc(0.75rem - 1px);
  width: 100%;
  ${focusStyles}
  &:focus {
    border-color: var(--grey-400);
  }

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
          border: solid 2px var(--grey-200);
          color: var(--grey-500);
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
          border: 2px solid rgba(0, 0, 0, 0.25);

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

            &:hover {

              ${StyledOrganizerBandItemLogo} {
                border-color: var(--black);
              }
            }
          `}
        `}
`;

const StyledOrganizerBandItemText = styled.span<{
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

const StyledSitemapIcon = styled.div`
  width: 32px;
  height: 36px;
  display: flex;
`;

const StyledOrganizerBandListItem = styled.li<{margin: string}>`
  margin-top: ${({ margin }) => margin ? 'auto' : '' };
`

const SitemapIcon: React.FC = () => {
  return(
    <StyledSitemapIcon>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 24.75V11.25" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="7.5" y="6.75" width="21" height="4.5" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 24L10.5 18.75H25.4807L30 24" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="15" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="27" y="24.75" width="6" height="6" stroke="#565656" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </StyledSitemapIcon>
  )
}

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
  margin?: string;
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
    margin
  }: OrganizerBandItemProps,
  ref: RefObject<HTMLAnchorElement>
) => {
  const selfRef = useRef<HTMLLIElement>(null);
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

  const [focused, setFocused] = useState(false)

  const getTooltipPosition = () => {
    if (selfRef.current) {

      const el = selfRef.current
      const {x, y} = el.getBoundingClientRect();

      return { x: x + el.clientWidth, y: y + el.clientHeight/2}
    }
  }


  return (
    <StyledOrganizerBandListItem margin={margin} ref={selfRef}>
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <StyledOrganizerBandItemLogo active={active} layout={layout} noBorder={noBorder}>
          {icon && feather[icon] ? (
            React.createElement(feather[icon])
          ) : icon === "sitemap" ? (
            <SitemapIcon />
          ) : logoRendition ? (
            <Image src={logoRendition.url} layout={'fill'} objectFit="contain" alt="" />
          ) : (
            <StyledOrganizerBandItemText layout={OrganizerBandLayout.narrow} aria-hidden>
              {children?.slice(0, 1)}
            </StyledOrganizerBandItemText>
          )}
        </StyledOrganizerBandItemLogo>

        {layout === OrganizerBandLayout.narrow ? (
          <MouseTooltip hoverElement={selfRef} position={getTooltipPosition()} inFocus={focused}>{children}</MouseTooltip>
        ) : (
          <StyledOrganizerBandItemText layout={layout}>{children}</StyledOrganizerBandItemText>
        )}
      </StyledOrganizerBandItem>
    </StyledOrganizerBandListItem>
  );
};

// eslint-disable-next-line react/display-name
export const OrganizerBandItem: React.FC<OrganizerBandItemProps> = React.forwardRef<
  HTMLAnchorElement,
  OrganizerBandItemProps
>(OrganizerBandItemForwarded);
