import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';

import { Header } from './Header';
import { MenuIcon } from './MenuIcon';
import { MenuLink, MenuLinkProps } from './MenuLink';

const StyledSubMenu = styled.div<{ active?: boolean }>`
  border: 1px solid var(--grey-400);
  border-top: none;
  width: 100%;
  background: ${({ active }) => (active ? 'var(--white)' : 'var(--grey-200)')};
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const StyledSubMenuHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid var(--grey-400);
`;

const StyledSubMenuTitle = styled.div``;
const StyledSubMenuIcon = styled.div``;

const StyledSubMenuContent = styled.div`
  padding: 1.125rem 0.75rem;
  display: grid;
  grid-row-gap: 0.75rem;
`;

const StyledSubMenuItem = styled.div``;

interface SubMenuProps {
  title: string;
  icon: React.ReactElement;
  links: React.ReactElement<MenuLinkProps>[];
  active?: boolean;
}

export const SubMenu: React.FC<SubMenuProps> = ({ title, icon, links, active }: SubMenuProps) => (
  <StyledSubMenu active={active}>
    <StyledSubMenuHead>
      <StyledSubMenuIcon>{icon}</StyledSubMenuIcon>
      <StyledSubMenuTitle>{title}</StyledSubMenuTitle>
    </StyledSubMenuHead>
    <StyledSubMenuContent>
      {links.map((item, index) => (
        <StyledSubMenuItem key={index}>{item}</StyledSubMenuItem>
      ))}
    </StyledSubMenuContent>
  </StyledSubMenu>
);

const StyledMainMenu = styled.div``;
const StyledMainMenuSubs = styled.div``;
const StyledMainMenuHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

interface MainMenuProps {
  subMenus: React.ReactElement<SubMenuProps>[];
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  title: string;
  Link: React.FC<{ content: React.ReactElement }>;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  subMenus,
  openState,
  title,
  Link,
}: MainMenuProps) => {
  const initialState = useState<boolean>(false);
  const [open, setOpen] = openState || initialState;

  return (
    <StyledMainMenu>
      <StyledMainMenuHeader>
        <Header title={title} Link={Link} openState={[open, setOpen]} />
      </StyledMainMenuHeader>
      <StyledMainMenuSubs>
        {subMenus.map((subMenu, index) => React.cloneElement(subMenu, { key: index }))}
      </StyledMainMenuSubs>
    </StyledMainMenu>
  );
};

export enum MenuIconName {
  start = 'start',
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
  user = 'user',
}

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
): [React.ReactElement, [boolean, React.Dispatch<React.SetStateAction<boolean>>]] => {
  const [open, setOpen] = useState<boolean>(false);

  const activeSubMenu = useMemo(
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

  const subMenus = structure.map(({ title, icon, links }, index) => {
    const renderedLinks = links.map(({ title, href, active }, linkIndex) => (
      <MenuLink title={title} href={href} active={active} key={linkIndex} />
    ));
    return (
      <SubMenu
        active={activeSubMenu === index}
        title={title}
        icon={<MenuIcon type={icon} />}
        links={renderedLinks}
        key={index}
      />
    );
  });

  const renderedMainMenu = (
    <MainMenu openState={[open, setOpen]} subMenus={subMenus} title={title} Link={Link} />
  );

  return [renderedMainMenu, [open, setOpen]];
};
