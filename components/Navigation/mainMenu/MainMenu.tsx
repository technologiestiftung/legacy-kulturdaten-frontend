import styled from '@emotion/styled';
import React, { useMemo } from 'react';

import { Header } from '../header/Header';
import { Sub, SubProps } from './Sub';
import { MenuIcon } from '../MenuIcon';
import { MenuLink } from '../MenuLink';

const StyledMainMenu = styled.div``;
const StyledMainMenuContent = styled.div``;
const StyledMainMenuSubs = styled.div``;
const StyledMainMenuHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
`;

interface MainMenuProps {
  subs: React.ReactElement<SubProps>[];
  title: string;
  Link: React.FC<{ content: React.ReactElement }>;
}

export const MainMenu: React.FC<MainMenuProps> = ({ subs, title, Link }: MainMenuProps) => {
  return (
    <StyledMainMenu>
      <StyledMainMenuHeader>
        <Header title={title} Link={Link} />
      </StyledMainMenuHeader>
      <StyledMainMenuContent>
        <StyledMainMenuSubs>
          {subs.map((sub, index) => React.cloneElement(sub, { key: index }))}
        </StyledMainMenuSubs>
      </StyledMainMenuContent>
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
