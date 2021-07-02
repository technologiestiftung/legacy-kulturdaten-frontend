import React, { useContext, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { Header } from '../header/Header';
import { HeaderLinkProps } from '../header/HeaderLink';
import { Sub, SubProps, SubVariant } from './Sub';
import { MenuIcon, MenuIconName } from './MenuIcon';
import { MenuLink, MenuLinkProps } from './MenuLink';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { NavigationContext } from '../NavigationContext';
import { useKeyboard } from '../../../lib/useKeyboard';
import { LocaleSwitch } from '../LocaleSwitch';
import { Button, ButtonSize, ButtonVariant, IconPosition } from '../../button';
import { SubDivider } from './SubDivider';
import { Categories } from '../../../config/categories';
import { Category, CategoryEntry, useList } from '../../../lib/categories';
import { ApiCall } from '../../../lib/api';
import { MenuFolder } from './MenuFolder';

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
  padding: 1.5rem 0.75rem;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 1.5rem;
`;

const StyledMainMenuHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

export interface MainMenuProps {
  menus: {
    key: string;
    content: React.ReactElement;
    expandable?: boolean;
  }[];
  defaultMenuKey: string;
  title: string;
  Link: React.FC<HeaderLinkProps>;
  subMenuKey?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  menus,
  defaultMenuKey,
  title,
  Link,
  subMenuKey,
}: MainMenuProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const {
    mainMenuOpen,
    setMainMenuOpen,
    activeMenuKey,
    setActiveMenuKey,
    setMenuExpanded,
  } = useContext(NavigationContext);

  const { rendered } = useContext(WindowContext);

  useKeyboard(() => {
    setMainMenuOpen(false);
  }, ['Esc', 'Escape']);

  const showMenuContent = rendered && (isMidOrWider || mainMenuOpen);

  const currentMenu = useMemo(() => {
    const menuKey = activeMenuKey || defaultMenuKey;
    return menus?.filter(({ key }) => key === menuKey)[0];
  }, [activeMenuKey, menus, defaultMenuKey]);

  useEffect(() => {
    if (typeof activeMenuKey === 'undefined') {
      setActiveMenuKey(subMenuKey);
    }
  }, [subMenuKey, setActiveMenuKey, activeMenuKey]);

  const renderedMenu = useMemo(() => {
    const isDefaultMenu = typeof activeMenuKey === 'undefined' || activeMenuKey === defaultMenuKey;

    return (
      <>
        <StyledMainMenuHeader>
          <Header
            title={title}
            Link={Link}
            button={
              !isDefaultMenu ? (
                <Button
                  variant={ButtonVariant.minimal}
                  onClick={() => setActiveMenuKey(defaultMenuKey)}
                  icon="ChevronLeft"
                  iconPosition={IconPosition.left}
                >
                  home
                </Button>
              ) : undefined
            }
            expandable={currentMenu.expandable}
            subMenuKey={subMenuKey}
            defaultMenuKey={defaultMenuKey}
          />
        </StyledMainMenuHeader>
        <StyledMainMenuContent show={showMenuContent}>
          <StyledMainMenuSubs>
            {currentMenu?.content}

            {isDefaultMenu && (
              <Sub items={[<LocaleSwitch key={1} />]} variant={SubVariant.minimal} />
            )}
          </StyledMainMenuSubs>
        </StyledMainMenuContent>
      </>
    );
  }, [
    title,
    Link,
    showMenuContent,
    activeMenuKey,
    defaultMenuKey,
    setActiveMenuKey,
    currentMenu,
    subMenuKey,
  ]);

  useEffect(() => {
    if (currentMenu.expandable !== true) {
      setMenuExpanded(false);
    }
  }, [currentMenu, setMenuExpanded]);

  return <StyledMainMenu fullscreen={showMenuContent}>{rendered && renderedMenu}</StyledMainMenu>;
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
    List?: React.FC<{ narrow?: boolean }>;
    subMenus?: {
      button?: React.ReactElement;
      title?: string;
      icon?: MenuIconName;
      headOptions?: {
        background?: string;
        color?: string;
        uppercase?: boolean;
      };
      variant?: SubVariant;
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
  Link: React.FC<HeaderLinkProps>,
  subMenuKey?: string
): React.ReactElement => {
  const { setMainMenuOpen } = useContext(NavigationContext);

  const menus = structure.menus.map(({ key, subMenus, List, expandable }, index) => {
    const subs = subMenus?.map(({ title, icon, items, headOptions, variant, button }, index) => {
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
            return <MenuFolder label={label} menuKey={menuKey} />;
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
          icon={icon ? <MenuIcon type={icon} /> : undefined}
          items={renderedItems}
          key={index}
          headOptions={headOptions}
          variant={variant}
          button={button}
        />
      );
    });

    return {
      key,
      expandable,
      content: (
        <>
          {List && React.createElement(List, { narrow: true })}
          {subs}
        </>
      ),
    };
  });

  const renderedMainMenu = (
    <MainMenu
      defaultMenuKey={structure.defaultMenuKey}
      menus={menus}
      title={title}
      Link={Link}
      subMenuKey={subMenuKey}
    />
  );

  return renderedMainMenu;
};

export const useMainMenuOverlayVisible = (): boolean => {
  const { mainMenuOpen, menuExpanded } = useContext(NavigationContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (menuExpanded && isMidOrWider) || (mainMenuOpen && !isMidOrWider);
};
