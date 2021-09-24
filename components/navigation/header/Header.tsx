import styled from '@emotion/styled';
import { useContext } from 'react';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { MenuItem, MenuItemLink, MenuItemType } from '../Menu';
import { HeaderMenuLink } from './HeaderMenuLink';
import { WrappedUser } from '../../user/useUser';
import { UserMenu } from './UserMenu';

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
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }
`;

const StyledLink = styled.a`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  text-decoration: none;
  color: inherit;
  padding: 0.75rem;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 0.75rem;
  }
  ${mq(Breakpoint.wide)} {
    padding: 1.125rem 1.5rem;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
  /* justify-self: stretch; */
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledHeaderMenuItems = styled.div`
  display: flex;
  padding: 0.75rem 0.375rem;
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

const StyledHeaderUserMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 0.75rem;
  position: absolute;
  top: 0.375rem;
  right: 0;
  z-index: 999;
  flex-basis: 0;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    top: 0.75rem;
    position: fixed;
    padding: 0 1.5rem;
  }
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ children: React.ReactElement<HTMLAnchorElement> }>;
  menuItems: MenuItem[];
  user: WrappedUser;
  customLink?: React.ReactElement;
}

export const HeaderMain: React.FC<HeaderProps> = ({
  title,
  Link,
  menuItems,
  user,
}: HeaderProps) => {
  const { rendered } = useContext(WindowContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const renderedLink = (
    <Link>
      <StyledLink>
        {/* A very very very very very very very very very very very very very very very very very very
        very very very long title */}
        {title}
      </StyledLink>
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
      {user?.isLoggedIn && (
        <>
          <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
          <StyledHeaderUserMenu>
            <UserMenu user={user} />
          </StyledHeaderUserMenu>
        </>
      )}
    </StyledHeader>
  ) : (
    user?.isLoggedIn && (
      <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
    )
  );
};

export const HeaderSecondary: React.FC<HeaderProps> = ({
  title,
  Link,
  customLink,
  user,
}: HeaderProps) => {
  const { rendered } = useContext(WindowContext);

  const renderedLink = customLink || (
    <Link>
      <StyledLink>
        {/* A very very very very very very very very very very very very very very very very very very
        very very very long title */}
        {title}
      </StyledLink>
    </Link>
  );

  return (
    <StyledHeader isSecondary>
      <StyledHeaderTitle>{rendered && renderedLink}</StyledHeaderTitle>
      {user?.isLoggedIn && (
        <StyledHeaderUserMenu>
          <UserMenu user={user} />
        </StyledHeaderUserMenu>
      )}
    </StyledHeader>
  );
};
