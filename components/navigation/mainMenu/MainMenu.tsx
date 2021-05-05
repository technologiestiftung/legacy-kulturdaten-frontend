import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { Header } from '../header/Header';
import { Sub, SubProps } from './Sub';
import { MenuIcon, MenuIconName } from '../MenuIcon';
import { MenuLink, MenuLinkProps } from '../MenuLink';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../../lib/WindowService';
import { NavigationContext } from '../NavigationContext';
import { useKeyboard } from '../../../lib/useKeyboard';

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
  Link: React.FC<{ content: React.ReactElement }>;
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
        </StyledMainMenuSubs>
      </StyledMainMenuContent>
    </StyledMainMenu>
  );
};

export enum MenuAction {
  link = 'link',
  button = 'button',
}

type MenuActionLink = {
  title: string;
  href: string;
  active?: boolean;
};

type MenuActionButton = {
  title: string;
  call: () => void;
};

type MenuStructure = {
  title: string;
  icon: MenuIconName;
  actions: {
    type: MenuAction;
    action: MenuActionLink | MenuActionButton;
  }[];
}[];

export const useMainMenu = (
  structure: MenuStructure,
  title: string,
  Link: React.FC<{ content: React.ReactElement }>
): React.ReactElement => {
  const { setMainMenuOpen } = useContext(NavigationContext);
  const subs = structure.map(({ title, icon, actions }, index) => {
    const renderedActions = actions?.map(({ type, action }, actionIndex) => {
      switch (type) {
        case MenuAction.link: {
          return <MenuLink key={actionIndex} {...(action as MenuLinkProps)} subMenuKey={index} />;
        }

        case MenuAction.button: {
          const { title, call } = action as MenuActionButton;
          return (
            <button
              onClick={() => {
                call();
                setMainMenuOpen(false);
              }}
            >
              {title}
            </button>
          );
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
        actions={renderedActions}
        key={index}
        subMenuKey={index}
      />
    );
  });

  const renderedMainMenu = <MainMenu subs={subs} title={title} Link={Link} />;

  return renderedMainMenu;
};
