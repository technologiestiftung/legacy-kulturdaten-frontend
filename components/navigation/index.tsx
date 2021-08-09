import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo } from 'react';
import { useCategory } from '../../lib/categories';
import { useKeyboard } from '../../lib/useKeyboard';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { HeaderComplete, HeaderPartMain, HeaderPartSecondary } from './header/Header';
import { HeaderLinkProps } from './header/HeaderLink';
import { Menu, MenuData, MenuItemType, MenuItemButton, MenuItemFolder, MenuItemLink } from './Menu';
import { NavigationContext } from './NavigationContext';

const StyledNavigation = styled.div<{ fullscreen?: boolean }>`
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

const StyledNavigationContent = styled.div<{ show: boolean }>`
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

const StyledNavigationHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

export interface NavigationProps {
  menus: {
    key: string;
    menu: React.ReactElement;
    title: string;
    expandable?: boolean;
  }[];
  defaultMenuKey: string;
  title: string;
  Link: React.FC<HeaderLinkProps>;
  subMenuKey?: string;
}

export type NavigationStructure = {
  header: {
    menuItems: {
      type: MenuItemType;
      action?: MenuItemLink | MenuItemButton | MenuItemFolder;
    }[];
  };
  menus: MenuData[];
};

export const useNavigation = (
  structure: NavigationStructure,
  title: string,
  Link: React.FC<HeaderLinkProps>,
  subMenuKey?: string
): {
  header: { main: React.ReactElement; secondary: React.ReactElement };
  sidebar: React.ReactElement;
} => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const category = useCategory();

  const menus = structure.menus.map((menuData) => {
    const { key, expandable, title } = menuData;

    return {
      key,
      expandable,
      title,
      menu: <Menu menuData={menuData} />,
    };
  });

  const currentMenu = useMemo(() => {
    const menuKey = category?.subMenuKey;
    return menuKey ? menus?.filter(({ key }) => key === menuKey)[0] : undefined;
  }, [category?.subMenuKey, menus]);

  // const renderedNavigation = (
  //   <Navigation
  //     defaultMenuKey={structure.defaultMenuKey}
  //     menus={menus}
  //     title={title}
  //     Link={Link}
  //     subMenuKey={subMenuKey}
  //   />
  // );

  const renderedHeaderMain = useMemo(
    () =>
      isMidOrWider ? (
        <HeaderComplete
          title={title}
          Link={Link}
          menuItems={structure.header.menuItems}
          user={undefined}
        />
      ) : (
        <HeaderPartMain
          title={title}
          Link={Link}
          menuItems={structure.header.menuItems}
          user={undefined}
        />
      ),
    [Link, isMidOrWider, structure.header.menuItems, title]
  );

  const renderedHeaderSecondary = isMidOrWider ? undefined : (
    <HeaderPartSecondary
      title={title}
      Link={Link}
      menuItems={structure.header.menuItems}
      user={undefined}
    />
  );

  return {
    header: { main: renderedHeaderMain, secondary: renderedHeaderSecondary },
    sidebar: currentMenu?.menu,
  };
};
