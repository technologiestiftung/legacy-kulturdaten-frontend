import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { Header } from '../header/Header';
import { Sub, SubProps } from './Sub';
import { MenuIcon, MenuIconName } from '../MenuIcon';
import { MenuLink } from '../MenuLink';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { NavigationContext } from '../NavigationContext';

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
          height: 100vh;
          overflow: hidden;
        `
      : ''};
`;

const StyledMainMenuContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  border-bottom: 1px solid var(--grey-400);
  flex-grow: 1;
  width: 100%;
  /* position: absolute; */
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
  const { mainMenuOpen } = useContext(NavigationContext);

  const showMenuContent = isWideOrWider || mainMenuOpen;

  return (
    <StyledMainMenu fullscreen={showMenuContent}>
      <StyledMainMenuHeader>
        <Header title={title} Link={Link} />
      </StyledMainMenuHeader>
      {showMenuContent ? (
        <StyledMainMenuContent>
          <StyledMainMenuSubs>
            {subs.map((sub, index) => React.cloneElement(sub, { key: index }))}
          </StyledMainMenuSubs>
        </StyledMainMenuContent>
      ) : (
        ''
      )}
    </StyledMainMenu>
  );
};

type MenuStructure = {
  title: string;
  icon: MenuIconName;
  links: {
    title: string;
    href: string;
    active?: boolean;
  }[];
}[];

export const useMainMenu = (
  structure: MenuStructure,
  title: string,
  Link: React.FC<{ content: React.ReactElement }>
): React.ReactElement => {
  const activeSub = useMemo(
    () =>
      structure.reduce<number>((activeIndex, item, index) => {
        for (let i = 0; i < item.links.length; i += 1) {
          if (item.links[i].active) {
            return index;
          }
        }
        return activeIndex;
      }, 0),
    [structure]
  );

  const subs = structure.map(({ title, icon, links }, index) => {
    const renderedLinks = links.map(({ title, href, active }, linkIndex) => (
      <MenuLink title={title} href={href} active={active} key={linkIndex} />
    ));
    return (
      <Sub
        active={activeSub === index}
        title={title}
        icon={<MenuIcon type={icon} />}
        links={renderedLinks}
        key={index}
      />
    );
  });

  const renderedMainMenu = <MainMenu subs={subs} title={title} Link={Link} />;

  return renderedMainMenu;
};
