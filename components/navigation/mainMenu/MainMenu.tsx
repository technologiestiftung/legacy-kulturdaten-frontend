import React, { useContext } from 'react';
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
  border: 1px solid var(--grey-400);
  border-bottom: none;
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
  border-bottom: 1px solid var(--grey-400);
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

const StyledMainMenuSubs = styled.div``;
const StyledMainMenuHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

export interface MainMenuProps {
  subs: React.ReactElement<SubProps>[];
  title: string;
  Link: React.FC<HeaderLinkProps>;
}

export const MainMenu: React.FC<MainMenuProps> = ({ subs, title, Link }: MainMenuProps) => {
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);
  const { mainMenuOpen, setMainMenuOpen } = useContext(NavigationContext);

  const { rendered } = useContext(WindowContext);

  useKeyboard(() => {
    setMainMenuOpen(false);
  }, ['Esc', 'Escape']);

  const showMenuContent = rendered && (isWideOrWider || mainMenuOpen);

  return (
    <StyledMainMenu fullscreen={showMenuContent}>
      <StyledMainMenuHeader>
        <Header title={title} Link={Link} />
      </StyledMainMenuHeader>
      <StyledMainMenuContent show={showMenuContent}>
        <StyledMainMenuSubs>
          {subs.map((sub, index) => React.cloneElement(sub, { key: index }))}
          <Sub items={[<LocaleSwitch key={1} />]} />
        </StyledMainMenuSubs>
      </StyledMainMenuContent>
    </StyledMainMenu>
  );
};

export enum MenuItem {
  link = 'link',
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

export type MenuStructure = {
  title?: string;
  icon?: MenuIconName;
  isActive?: boolean;
  items: {
    type: MenuItem;
    action?: MenuItemLink | MenuItemButton;
  }[];
}[];

export const useMainMenu = (
  structure: MenuStructure,
  title: string,
  Link: React.FC<HeaderLinkProps>
): React.ReactElement => {
  const { setMainMenuOpen } = useContext(NavigationContext);
  const subs = structure.map(({ title, icon, items, isActive }, index) => {
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
        isActive={isActive}
      />
    );
  });

  const renderedMainMenu = <MainMenu subs={subs} title={title} Link={Link} />;

  return renderedMainMenu;
};

export const useMainMenuOverlayVisible = (): boolean => {
  const { mainMenuOpen } = useContext(NavigationContext);
  const isWideOrWider = useBreakpointOrWider(Breakpoint.wide);

  return mainMenuOpen && !isWideOrWider;
};
