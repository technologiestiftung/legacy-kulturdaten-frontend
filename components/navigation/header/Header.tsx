import styled from '@emotion/styled';
import { useContext } from 'react';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { MenuItem, MenuItemLink, MenuItemType } from '../Menu';
import { HeaderMenuLink } from './HeaderMenuLink';
import { User } from '../../user/useUser';

const StyledHeader = styled.header<{ isSecondary?: boolean }>`
  width: 100%;
  background: var(--white);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${mq(Breakpoint.mid)} {
    box-shadow: none;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
`;

const StyledLink = styled.a`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  text-decoration: none;
  color: inherit;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 0.75rem;
  }
  ${mq(Breakpoint.wide)} {
    padding: 1.125rem 1.5rem;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
`;

const StyledHeaderMenuItems = styled.div`
  display: flex;
  padding: 0.75rem 0.375rem;
`;

const StyledHeaderButton = styled.div`
  padding: 0.375rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem;
  }
`;

const StyledExpandableButton = styled.button`
  appearance: none;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--black);
  border-left: 1px solid var(--grey-400);
  align-self: stretch;
  width: 3.75rem;
  cursor: pointer;
  color: var(--white);

  &:hover {
    background: var(--grey-600);
  }
`;

const StyledHeaderMenuItem = styled.div`
  flex-shrink: 0;
  padding: 0 0.375rem;
`;

const HeaderMenuDivider = styled.div`
  display: block;
  background: var(--grey-400);
  height: 100%;
  border-top: 0.375rem solid var(--white);
  border-bottom: 0.375rem solid var(--white);
  width: 1px;
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ children: React.ReactElement<HTMLAnchorElement> }>;
  menuItems: MenuItem[];
  user: User;
  userIsLoggedIn: boolean;
}

export const HeaderMain: React.FC<HeaderProps> = ({
  title,
  Link,
  menuItems,
  userIsLoggedIn,
}: HeaderProps) => {
  const { rendered } = useContext(WindowContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const renderedLink = (
    <Link>
      <StyledLink>{title}</StyledLink>
    </Link>
  );

  const renderedMenuSection = menuItems.map(({ type, action }, index) => {
    switch (type) {
      case MenuItemType.link: {
        return (
          <StyledHeaderMenuItem key={index}>
            <HeaderMenuLink {...(action as MenuItemLink)} />
          </StyledHeaderMenuItem>
        );
      }

      case MenuItemType.divider: {
        return (
          <StyledHeaderMenuItem key={index}>
            <HeaderMenuDivider />
          </StyledHeaderMenuItem>
        );
      }

      default: {
        return null;
      }
    }
  });

  return isMidOrWider ? (
    <StyledHeader>
      <StyledHeaderTitle>{rendered && renderedLink}</StyledHeaderTitle>
      {userIsLoggedIn && (
        <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
      )}
    </StyledHeader>
  ) : (
    userIsLoggedIn && (
      <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
    )
  );
};

export const HeaderSecondary: React.FC<HeaderProps> = ({ title, Link }: HeaderProps) => {
  const { rendered } = useContext(WindowContext);

  const renderedLink = (
    <Link>
      <StyledLink>{title}</StyledLink>
    </Link>
  );

  return (
    <StyledHeader isSecondary>
      <StyledHeaderTitle>{rendered && renderedLink}</StyledHeaderTitle>
    </StyledHeader>
  );
};
