import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { Header } from '../header/Header';
import { HeaderLinkProps } from '../header/HeaderLink';
import { Sub, SubProps } from './Sub';
import { MenuIcon, MenuIconName } from './MenuIcon';
import { MenuLink, MenuLinkProps } from './MenuLink';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { NavigationContext } from '../NavigationContext';
import { useKeyboard } from '../../../lib/useKeyboard';
import { LocaleSwitch } from '../LocaleSwitch';
import { Button, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { SubDivider } from './SubDivider';

const StyledMainMenu = styled.div<{ fullscreen?: boolean }>`
  background: var(--grey-200);
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ fullscreen }) =>
    fullscreen
      ? css`
          height: var(--app-height);
          overflow: hidden;
        `
      : ''};
`;

const StyledMainMenuContent = styled.div<{ show: boolean }>`
  display: none;
  visibility: hidden;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);

  ${({ show }) =>
    show
      ? css`
          display: block;
          visibility: inherit;
        `
      : ''}
`;

const StyledMainMenuSubs = styled.div`
  padding: 0.75rem;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 0.75rem;
`;

const StyledMainMenuHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

const StyledMainMenuFolder = styled.div`
  position: absolute;
  background: orange;
  height: 10px;
  width: 100%;
`;

export interface MainMenuProps {
  menus: { key: string; subMenus: React.ReactElement<SubProps>[] }[];
  defaultMenuKey: string;
  title: string;
  Link: React.FC<HeaderLinkProps>;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  menus,
  defaultMenuKey,
  title,
  Link,
}: MainMenuProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const { mainMenuOpen, setMainMenuOpen, activeMenuKey, setActiveMenuKey } = useContext(
    NavigationContext
  );

  const { rendered } = useContext(WindowContext);

  useKeyboard(() => {
    setMainMenuOpen(false);
  }, ['Esc', 'Escape']);

  const showMenuContent = rendered && (isMidOrWider || mainMenuOpen);

  const renderedMenu = useMemo(() => {
    const menuKey = activeMenuKey || defaultMenuKey;
    const isDefaultMenu = typeof activeMenuKey === 'undefined' || activeMenuKey === defaultMenuKey;

    return (
      <>
        <StyledMainMenuHeader>
          <Header
            title={title}
            Link={Link}
            button={
              !isDefaultMenu ? (
                <Button onClick={() => setActiveMenuKey(defaultMenuKey)}>back</Button>
              ) : undefined
            }
          />
        </StyledMainMenuHeader>
        <StyledMainMenuContent show={showMenuContent}>
          <StyledMainMenuSubs>
            {menus
              ?.filter(({ key }) => key === menuKey)[0]
              ?.subMenus?.map((sub, index) => React.cloneElement(sub, { key: index }))}
            <Sub items={[<LocaleSwitch key={1} />]} />
          </StyledMainMenuSubs>
        </StyledMainMenuContent>
      </>
    );
  }, [title, Link, showMenuContent, activeMenuKey, defaultMenuKey, menus, setActiveMenuKey]);

  return <StyledMainMenu fullscreen={showMenuContent}>{renderedMenu}</StyledMainMenu>;
};

export enum MenuItem {
  link = 'link',
  folder = 'folder',
  button = 'button',
  divider = 'divider',
}

type MenuItemLink = {
  title: string;
  href: string;
  active?: boolean;
};

type MenuItemButton = {
  label: string;
  onClick: () => void;
  icon?: string;
  iconPosition?: IconPosition;
};

type MenuItemFolder = {
  label: string;
  menuKey: string;
};

export type MenuStructure = {
  defaultMenuKey: string;
  menus: {
    key: string;
    expandable: boolean;
    subMenus: {
      title?: string;
      icon?: MenuIconName;
      headBackground?: string;
      items: {
        type: MenuItem;
        action?: MenuItemLink | MenuItemButton | MenuItemFolder;
      }[];
    }[];
  }[];
};

export const useMainMenu = (
  structure: MenuStructure,
  title: string,
  Link: React.FC<HeaderLinkProps>
): React.ReactElement => {
  const { setMainMenuOpen, setActiveMenuKey } = useContext(NavigationContext);

  const menus = structure.menus.map(({ key, subMenus }, index) => {
    const subs = subMenus.map(({ title, icon, items, headBackground }, index) => {
      const renderedItems = items?.map(({ type, action }, actionIndex) => {
        switch (type) {
          case MenuItem.link: {
            return <MenuLink key={actionIndex} {...(action as MenuLinkProps)} subMenuKey={index} />;
          }

          case MenuItem.button: {
            const { label, onClick, icon, iconPosition } = action as MenuItemButton;
            return (
              <Button
                onClick={() => {
                  onClick();
                  setMainMenuOpen(false);
                }}
                variant={ButtonVariant.minimal}
                size={ButtonSize.small}
                icon={icon}
                iconPosition={iconPosition}
              >
                {label}
              </Button>
            );
          }

          case MenuItem.folder: {
            const { label, menuKey } = action as MenuItemFolder;
            return (
              <div
                onClick={() => {
                  setActiveMenuKey(menuKey);
                }}
              >
                {label}: {menuKey}
              </div>
            );
          }

          case MenuItem.divider: {
            return <SubDivider />;
          }

          default: {
            break;
          }
        }
      });

      return (
        <Sub
          title={title}
          icon={<MenuIcon type={icon} />}
          items={renderedItems}
          key={index}
          headBackground={headBackground}
        />
      );
    });

    return { key, subMenus: subs };
  });

  const renderedMainMenu = (
    <MainMenu defaultMenuKey={structure.defaultMenuKey} menus={menus} title={title} Link={Link} />
  );

  return renderedMainMenu;
};

export const useMainMenuOverlayVisible = (): boolean => {
  const { mainMenuOpen } = useContext(NavigationContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return mainMenuOpen && !isMidOrWider;
};
