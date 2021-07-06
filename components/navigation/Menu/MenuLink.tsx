import Link from 'next/link';
import styled from '@emotion/styled';

import { useIsRouteStringActive } from '../../../lib/routing';
import { useContext } from 'react';
import { NavigationContext } from '../NavigationContext';
import { insetBorder } from '../../globals/Constants';
import { File } from 'react-feather';

const StyledA = styled.a<{ active?: boolean }>`
  color: inherit;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  box-shadow: ${insetBorder(true, false, false)};
  background: var(--white);

  &:hover {
    text-decoration: underline;
    background: var(--grey-350);
  }

  svg {
    display: inline-block;
    margin: 0 0.75rem 0 0;
    padding: 0;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--black);
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
}

export interface MenuLinkProps extends InternalMenuLinkProps {
  type?: MenuLinkType;
}

const InternalMenuLink: React.FC<InternalMenuLinkProps> = ({
  title,
  href,
  active,
}: InternalMenuLinkProps) => {
  const isRouteActive = useIsRouteStringActive(href);
  const linkIsActive = active || isRouteActive;
  const { setNavigationOpen } = useContext(NavigationContext);

  return (
    <Link href={href} passHref>
      <StyledA title={title} onClick={() => setNavigationOpen(false)} active={linkIsActive}>
        <File />
        <span>{title}</span>
      </StyledA>
    </Link>
  );
};

export const MenuLink: React.FC<MenuLinkProps> = (props: MenuLinkProps) => {
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
