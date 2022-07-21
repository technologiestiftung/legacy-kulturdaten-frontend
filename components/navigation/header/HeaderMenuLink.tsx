import React, { useContext, useMemo } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import * as feather from 'react-feather';

import { useIsRouteStringActive } from '../../../lib/routing';
import { css } from '@emotion/react';
import { NavigationContext } from '../NavigationContext';
import { focusBlackStyles, focusStyles } from '../../globals/Constants'

const StyledA = styled.a<{ active?: boolean; disabled?: boolean }>`
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: calc(0.375rem - 1px) calc(0.75rem - 1px);
  border: 1px solid var(--grey-400);
  background: var(--white);
  border-radius: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  transition: background var(--transition-duration-fast);

  ${focusStyles}
  
  &:hover {
    background: var(--grey-400);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.3;

      &:hover {
        background: var(--white);
      }
    `}

  ${({ active }) =>
    active
      ? css`
          background: var(--black);
          ${focusBlackStyles}
          border-color: var(--black);
          color: var(--white);

          &:focus {
            margin: 0;
          }
          &:hover {
            background: var(--black);
          }
        `
      : ''}
`;

const StyledHeaderMenuLinkIcon = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export enum MenuLinkType {
  internal = 'internal',
  external = 'external',
}

interface InternalMenuLinkProps {
  title: string;
  href: string;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  __TYPE?: 'HeaderMenuLink';
}

export interface HeaderMenuLinkProps extends InternalMenuLinkProps {
  type?: MenuLinkType;
}

const InternalMenuLink: React.FC<InternalMenuLinkProps> = ({
  title,
  href,
  active,
  icon,
  onClick,
  disabled = false,
}: InternalMenuLinkProps) => {
  const isRouteActive = useIsRouteStringActive(href);
  const linkIsActive = active !== undefined ? active : isRouteActive;
  const isDisabled = useMemo(() => disabled && !linkIsActive, [disabled, linkIsActive]);
  const { setMenuExpanded } = useContext(NavigationContext);

  const renderedStyledLink = (
    <StyledA
      title={title}
      active={linkIsActive}
      onClick={() => {
        if (onClick) {
          onClick();
        }

        setMenuExpanded(false);
      }}
      as={isDisabled ? 'div' : undefined}
      disabled={isDisabled}
    >
      <span>{title}</span>
      {icon && (
        <StyledHeaderMenuLinkIcon>{React.createElement(feather[icon])}</StyledHeaderMenuLinkIcon>
      )}
    </StyledA>
  );

  return !isDisabled ? (
    <Link href={href} passHref>
      {renderedStyledLink}
    </Link>
  ) : (
    renderedStyledLink
  );
};

export const HeaderMenuLink: React.FC<HeaderMenuLinkProps> = (props: HeaderMenuLinkProps) => {
  const { type = MenuLinkType.internal } = props;

  switch (type) {
    case MenuLinkType.internal: {
      return <InternalMenuLink {...props} />;
    }

    case MenuLinkType.external: {
      const { title, href } = props;
      return (
        <StyledA href={href} rel="noopener noreferrer" target="_blank">
          {title}
        </StyledA>
      );
    }

    default: {
      throw new Error(`MenuLink type "${type}" is not valid`);
    }
  }
};

HeaderMenuLink.defaultProps = {
  __TYPE: 'HeaderMenuLink',
};
