import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import { useCategory } from '../../lib/categories';
import { useLanguage, useLocale } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { useOrganizer, useOrganizerId } from '../../lib/useOrganizer';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Layouts } from '../layouts/AppLayout';
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
    loggedIn: {
      menuItems: {
        type: MenuItemType;
        action?: MenuItemLink | MenuItemButton | MenuItemFolder;
      }[];
    };
    loggedOut: {
      menuItems: {
        type: MenuItemType;
        action?: MenuItemLink | MenuItemButton | MenuItemFolder;
      }[];
    };
  };
  menus: MenuData[];
};

export const useNavigation = (
  structure: NavigationStructure,
  title: string,
  Link: React.FC<HeaderLinkProps>,
  layout: Layouts
): {
  header: { main: React.ReactElement; secondary: React.ReactElement };
  sidebar: React.ReactElement;
} => {
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const category = useCategory();
  const user = useUser();
  const locale = useLocale();
  const router = useRouter();
  const language = useLanguage();

  const activeHeader = useMemo(
    () => (user?.isLoggedIn ? structure?.header?.loggedIn : structure?.header?.loggedOut),
    [user?.isLoggedIn, structure?.header]
  );

  const isEntryPage = useMemo(
    () => router?.pathname === '/app/[organizer]/[category]/[id]/[sub]',
    [router?.pathname]
  );

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

  const organizerId = useOrganizerId();

  const customHeaderLink = useMemo(
    () =>
      isEntryPage && !isMidOrWider && category ? (
        <HeaderBackLink
          href={category.routes.list({ locale, query: { organizer: organizerId } })}
          title={category.title.plural}
        />
      ) : undefined,
    [isEntryPage, category, isMidOrWider, locale, organizerId]
  );

  const organizer = useOrganizer();

  const headerTitle = organizer
    ? getTranslation(language, organizer.data.relations?.translations)?.attributes.name
    : title;

  const renderedHeaderMain = (
    <HeaderMain
      user={user}
      title={headerTitle}
      Link={Link}
      menuItems={activeHeader.menuItems}
      layout={layout}
    />
  );

  const renderedHeaderSecondary = isMidOrWider ? undefined : (
    <HeaderSecondary
      user={user}
      title={headerTitle}
      Link={Link}
      menuItems={activeHeader.menuItems}
      customLink={customHeaderLink}
      layout={layout}
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
