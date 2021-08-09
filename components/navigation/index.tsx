import { useMemo } from 'react';
import { useCategory } from '../../lib/categories';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { useUser } from '../user/useUser';
import { HeaderMain, HeaderSecondary } from './header/Header';
import { HeaderLinkProps } from './header/HeaderLink';
import { Menu, MenuData, MenuItemType, MenuItemButton, MenuItemFolder, MenuItemLink } from './Menu';

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
  Link: React.FC<HeaderLinkProps>
): {
  header: { main: React.ReactElement; secondary: React.ReactElement };
  sidebar: React.ReactElement;
} => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const category = useCategory();
  const user = useUser();

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

  const renderedHeaderMain = (
    <HeaderMain
      user={user?.user}
      userIsLoggedIn={user?.isLoggedIn}
      title={title}
      Link={Link}
      menuItems={structure.header.menuItems}
    />
  );

  const renderedHeaderSecondary = isMidOrWider ? undefined : (
    <HeaderSecondary
      user={user?.user}
      userIsLoggedIn={user?.isLoggedIn}
      title={title}
      Link={Link}
      menuItems={structure.header.menuItems}
    />
  );

  return {
    header: { main: renderedHeaderMain, secondary: renderedHeaderSecondary },
    sidebar: currentMenu?.menu,
  };
};
