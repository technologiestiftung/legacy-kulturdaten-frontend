import styled from '@emotion/styled';
import { useContext, useEffect } from 'react';
import Head from 'next/head';

import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { mq } from '../../globals/Constants';
import { MenuItem, MenuItemLink, MenuItemType } from '../Menu';
import { HeaderMenuLink } from './HeaderMenuLink';
import { LocaleSwitch, LocaleSwitchVariant } from '../../navigation/LocaleSwitch';
import { WrappedUser } from '../../user/useUser';
import { UserMenu } from './UserMenu';
import { css } from '@emotion/react';
import { useCollapsable } from '../../collapsable';
import { ChevronDown } from 'react-feather';
import { OrganizerBand, OrganizerBandLayout } from '../OrganizerBand';
import { useT } from '../../../lib/i18n';
import { useActiveRoute } from '../../../lib/routing';
import { NavigationContext } from '../NavigationContext';
import { useRouter } from 'next/router';
import { appLayouts, Layouts } from '../../layouts/AppLayout';
import { useAppTitle } from '../../../config/structure';
import { UserContext } from '../../user/UserContext';
import { focusStyles } from '../../globals/Constants';

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

  ${({ isSecondary }) =>
    isSecondary &&
    css`
      color: inherit;
      background: transparent;
    `}
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
  overflow: visible;

  ${focusStyles}


  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 0.375rem 1.125rem 0.75rem;
  }
  ${mq(Breakpoint.wide)} {
    padding: 1.125rem 0.75rem 1.125rem 1.5rem;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;

  > a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledHeaderTitleText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 0.75rem 1.5rem;
  }
`;

const StyledHeaderMenuItems = styled.ul`
  display: flex;
  padding: 0.75rem 0.375rem;
`;

const StyledHeaderMenuItem = styled.li`
  flex-shrink: 0;
  padding: 0 0.375rem;
`;

const HeaderMenuDivider = styled.div<{ disabled?: boolean }>`
  display: block;
  background: var(--grey-400);
  height: 100%;
  border-top: 0.375rem solid var(--white);
  border-bottom: 0.375rem solid var(--white);
  width: 1px;

  ${({ disabled }) => disabled && 'opacity: 0.3;'}
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
  }

  ${mq(Breakpoint.wide)} {
    padding: 0 1.5rem;
  }
`;

interface HeaderProps {
  title: string;
  Link: React.FC<{ children: React.ReactElement<HTMLAnchorElement> }>;
  menuItems: MenuItem[];
  user: WrappedUser;
  layout: Layouts;
  customLink?: React.ReactElement;
  disabled?: boolean;
}

export const HeaderMain: React.FC<HeaderProps> = ({
  title,
  Link,
  menuItems,
  user,
  disabled = false,
}: HeaderProps) => {
  const { rendered } = useContext(WindowContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const appTitle = useAppTitle();
  const { userInactive } = useContext(UserContext);

  const activeRoute = useActiveRoute();
  const t = useT();

  const displayRoute = activeRoute ? t(`menu.start.items.${activeRoute}`): undefined

  const renderedLink = (
    <Link>
      <StyledLink>{title}</StyledLink>
    </Link>
  );

  const renderedMenuSection = menuItems.map(({ type, action, disabled: itemDisabled }, index) => {
    switch (type) {
      case MenuItemType.link: {
        return (
          <StyledHeaderMenuItem key={index}>
            <HeaderMenuLink
              {...(action as MenuItemLink)}
              disabled={typeof itemDisabled === 'boolean' ? itemDisabled : disabled}
              onClick={action.onClick}
            />
          </StyledHeaderMenuItem>
        );
      }

      case MenuItemType.divider: {
        return (
          <StyledHeaderMenuItem key={index}>
            <HeaderMenuDivider disabled={disabled} />
          </StyledHeaderMenuItem>
        );
      }

      default: {
        return null;
      }
    }
  });

  return (
    <>
      <Head>
        <title>{title !== appTitle ? `${title} – ${displayRoute} - ${appTitle}` : appTitle}</title>
      </Head>
      {isMidOrWider ? (
        <StyledHeader>
          <StyledHeaderTitle>
            {rendered &&
              (!userInactive ? (
                renderedLink
              ) : (
                <StyledHeaderTitleText>{appTitle}</StyledHeaderTitleText>
              ))}
          </StyledHeaderTitle>
          <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
          {user?.isLoggedIn && (
            <StyledHeaderUserMenu>
              <UserMenu user={user} />
            </StyledHeaderUserMenu>
          )}
          {!user?.isLoggedIn && <LocaleSwitch switchVariant={LocaleSwitchVariant.minimal} />}
        </StyledHeader>
      ) : (
        <StyledHeaderMenuItems>{rendered && renderedMenuSection}</StyledHeaderMenuItems>
      )}
    </>
  );
};

const StyledHeaderOrganizerMenu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  white-space: nowrap;
`;

const StyledHeaderOrganizerMenuButton = styled.button<{ isCollapsed: boolean }>`
  appearance: none;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  background: transparent;
  border: none;
  padding: 0.75rem;
  margin: 0;
  display: flex;
  flex-grow: 1;
  color: inherit;
  max-width: calc(100% - 0.75rem - 2.25rem);
  justify-content: flex-start;
  text-align: left;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > svg {
    flex-shrink: 0;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    padding-right: 0.375rem;
    transition: transform var(--transition-duration);
    transform: ${({ isCollapsed }) => (isCollapsed ? 'rotateX(0deg)' : 'rotateX(-180deg)')};
    transform-origin: 50% 50%;
  }
`;

const StyledHeaderOrganizerMenuList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
`;

interface HeaderOrganizerMenuProps {
  title: string;
}

const HeaderOrganizerMenu: React.FC<HeaderOrganizerMenuProps> = ({
  title,
}: HeaderOrganizerMenuProps) => {
  const t = useT();
  const router = useRouter();

  const renderedOrganizerList = (
    <StyledHeaderOrganizerMenuList>
      <OrganizerBand layout={OrganizerBandLayout.wide} />
    </StyledHeaderOrganizerMenuList>
  );

  const { headerOrganizerBandCollapsed, setHeaderOrganizerBandCollapsed } =
    useContext(NavigationContext);

  const { renderedCollapsable } = useCollapsable(
    renderedOrganizerList,
    headerOrganizerBandCollapsed,
    setHeaderOrganizerBandCollapsed
  );

  useEffect(() => {
    if (router.asPath) {
      setHeaderOrganizerBandCollapsed(true);
    }
  }, [router?.asPath, setHeaderOrganizerBandCollapsed]);

  return (
    <StyledHeaderOrganizerMenu>
      <StyledHeaderOrganizerMenuButton
        onClick={() => setHeaderOrganizerBandCollapsed(!headerOrganizerBandCollapsed)}
        isCollapsed={headerOrganizerBandCollapsed}
        aria-label={
          t(
            headerOrganizerBandCollapsed ? 'menu.organizerBand.show' : 'menu.organizerBand.collapse'
          ) as string
        }
      >
        <ChevronDown />
        <span>{title}</span>
      </StyledHeaderOrganizerMenuButton>
      <div>{renderedCollapsable}</div>
    </StyledHeaderOrganizerMenu>
  );
};

export const HeaderSecondary: React.FC<HeaderProps> = ({
  title,
  customLink,
  user,
  layout,
  Link,
}: HeaderProps) => {
  const { rendered } = useContext(WindowContext);
  const activeLayout = appLayouts[layout];
  const appTitle = useAppTitle();
  const { userInactive } = useContext(UserContext);

  const renderedLink = activeLayout?.hasOrganizerBand ? (
    customLink ? (
      <StyledHeaderTitle>{customLink}</StyledHeaderTitle>
    ) : (
      <HeaderOrganizerMenu title={title} />
    )
  ) : (
    <StyledHeaderTitle>
      {!userInactive ? (
        <Link>
          <StyledLink>{appTitle}</StyledLink>
        </Link>
      ) : (
        <StyledHeaderTitleText>{appTitle}</StyledHeaderTitleText>
      )}
    </StyledHeaderTitle>
  );

  return (
    <StyledHeader isSecondary>
      {rendered && renderedLink}
      {user?.isLoggedIn && (
        <StyledHeaderUserMenu>
          <UserMenu user={user} />
        </StyledHeaderUserMenu>
      )}
      {!user?.isLoggedIn && <LocaleSwitch switchVariant={LocaleSwitchVariant.minimal} />}
    </StyledHeader>
  );
};
