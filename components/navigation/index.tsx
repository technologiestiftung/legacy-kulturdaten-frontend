import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useEffect, useMemo } from 'react';
import { useKeyboard } from '../../lib/useKeyboard';
import { Breakpoint, useBreakpointOrWider, WindowContext } from '../../lib/WindowService';
import { Header } from './header/Header';
import { HeaderLinkProps } from './header/HeaderLink';
import { LocaleSwitch } from './LocaleSwitch';
import { Menu, MenuData } from './Menu';
import { MenuSection, MenuSectionVariant } from './Menu/MenuSection';
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

const StyledNavigationLocaleSwitchContainer = styled.div`
  padding: 0 0.75rem 1.5rem;
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

export const Navigation: React.FC<NavigationProps> = ({
  menus,
  defaultMenuKey,
  title,
  Link,
  subMenuKey,
}: NavigationProps) => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const {
    navigationOpen,
    setNavigationOpen,
    activeMenuKey,
    setActiveMenuKey,
    setMenuExpanded,
  } = useContext(NavigationContext);

  const { rendered } = useContext(WindowContext);

  useKeyboard(() => {
    setNavigationOpen(false);
  }, ['Esc', 'Escape']);

  const showNavigationContent = rendered && (isMidOrWider || navigationOpen);

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
        <StyledNavigationHeader>
          <Header
            title={title}
            Link={Link}
            expandable={currentMenu.expandable}
            subMenuKey={subMenuKey}
            defaultMenuKey={defaultMenuKey}
            activeMenuTitle={currentMenu.title}
          />
        </StyledNavigationHeader>
        <StyledNavigationContent show={showNavigationContent}>
          {currentMenu.menu}
          {isDefaultMenu && (
            <StyledNavigationLocaleSwitchContainer>
              <MenuSection
                items={[<LocaleSwitch key={1} />]}
                variant={MenuSectionVariant.minimal}
              />
            </StyledNavigationLocaleSwitchContainer>
          )}
        </StyledNavigationContent>
      </>
    );
  }, [title, Link, showNavigationContent, activeMenuKey, defaultMenuKey, currentMenu, subMenuKey]);

  useEffect(() => {
    if (currentMenu.expandable !== true) {
      setMenuExpanded(false);
    }
  }, [currentMenu, setMenuExpanded]);

  return (
    <StyledNavigation fullscreen={showNavigationContent}>
      {rendered && renderedMenu}
    </StyledNavigation>
  );
};

export type NavigationStructure = {
  defaultMenuKey: string;
  menus: MenuData[];
};

export const useNavigation = (
  structure: NavigationStructure,
  title: string,
  Link: React.FC<HeaderLinkProps>,
  subMenuKey?: string
): React.ReactElement => {
  const { menuExpanded } = useContext(NavigationContext);

  const menus = structure.menus.map((menuData) => {
    const { key, expandable, title } = menuData;

    return {
      key,
      expandable,
      title,
      menu: <Menu menuData={menuData} expanded={menuExpanded} />,
    };
  });

  const renderedNavigation = (
    <Navigation
      defaultMenuKey={structure.defaultMenuKey}
      menus={menus}
      title={title}
      Link={Link}
      subMenuKey={subMenuKey}
    />
  );

  return renderedNavigation;
};

export const useNavigationOverlayVisible = (): boolean => {
  const { navigationOpen, menuExpanded } = useContext(NavigationContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return (menuExpanded && isMidOrWider) || (navigationOpen && !isMidOrWider);
};
