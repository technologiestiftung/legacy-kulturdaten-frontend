import Link from 'next/link';
import styled from '@emotion/styled';

import { ArrowRightSvg } from './ArrowRightSvg';
import { useIsRouteStringActive } from '../../lib/routing';
import { useContext, useEffect } from 'react';
import { NavigationContext } from './NavigationContext';

const StyledA = styled.a<{ active?: boolean }>`
  color: inherit;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  display: flex;
  align-items: center;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }

  svg {
    display: inline-block;
    margin: 0 0.375rem 0 0;
    padding: 0;
  }
`;

export enum MenuLinkType {
  internal = 'internal',
  external = 'external',
}

interface InternalMenuLinkProps {
  title: string;
  href: string;
  subMenuKey: number;
  active?: boolean;
}

export interface MenuLinkProps extends InternalMenuLinkProps {
  type?: MenuLinkType;
}

const InternalMenuLink: React.FC<InternalMenuLinkProps> = ({
  title,
  href,
  subMenuKey,
  active,
}: InternalMenuLinkProps) => {
  const isRouteActive = useIsRouteStringActive(href);
  const linkIsActive = active || isRouteActive;
  const { setMainMenuOpen, setActiveSubMenu } = useContext(NavigationContext);

  useEffect(() => {
    if (linkIsActive) {
      setActiveSubMenu(subMenuKey);
    }
  }, [linkIsActive, setActiveSubMenu, subMenuKey]);

  return (
    <Link href={href} passHref>
      <StyledA title={title} onClick={() => setMainMenuOpen(false)} active={linkIsActive}>
        {linkIsActive ? <ArrowRightSvg /> : ''}
        {title}
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
