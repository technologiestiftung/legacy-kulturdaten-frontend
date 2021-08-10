import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import { useCategory } from '../../lib/categories';
import { useLocale } from '../../lib/routing';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { useUser } from '../user/useUser';
import { HeaderMain, HeaderSecondary } from './header/Header';
import { HeaderBackLink } from './header/HeaderBackLink';
import { HeaderLinkProps } from './header/HeaderLink';
import { Menu, MenuData, MenuItemType, MenuItemButton, MenuItemFolder, MenuItemLink } from './Menu';
import { NavigationContext } from './NavigationContext';

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
  const locale = useLocale();
  const router = useRouter();

  const isEntryPage = useMemo(() => router?.pathname === '/app/[category]/[id]/[sub]', [
    router?.pathname,
  ]);

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

  const customHeaderLink = useMemo(
    () =>
      isEntryPage && !isMidOrWider && category ? (
        <HeaderBackLink href={category.routes.list({ locale })} title={category.title.plural} />
      ) : undefined,
    [isEntryPage, category, isMidOrWider, locale]
  );

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
      customLink={customHeaderLink}
    />
  );

  return {
    header: { main: renderedHeaderMain, secondary: renderedHeaderSecondary },
    sidebar: currentMenu?.menu,
  };
};

export const useNavigationOverlayVisible = (): boolean => {
  const { menuExpanded } = useContext(NavigationContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  return menuExpanded && isMidOrWider;
};
