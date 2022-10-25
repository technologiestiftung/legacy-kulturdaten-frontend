import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo } from 'react';
import { useCategory } from '../../lib/categories';
import { useT } from '../../lib/i18n';
import { useActiveRoute, useLanguage, useLocale, Routes, routes } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { useOrganizer, useOrganizerId } from '../../lib/useOrganizer';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { appLayouts, Layouts } from '../layouts/AppLayout';
import { useUser } from '../user/useUser';
import { HeaderMain, HeaderSecondary } from './header/Header';
import { HeaderBackLink } from './header/HeaderBackLink';
import { HeaderLinkProps } from './header/HeaderLink';
import { Menu, MenuData, MenuItem } from './Menu';
import { defaultOrganizerId, NavigationContext } from './NavigationContext';

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
      menuItems: MenuItem[];
    };
    loggedInMeta: {
      menuItems: MenuItem[];
    };
    loggedOut: {
      menuItems: MenuItem[];
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
  const t = useT();
  const activeLayout = useMemo(() => appLayouts[layout], [layout]);
  const activeRoute = useActiveRoute();

  const activeHeader = useMemo(
    () =>
      user?.isLoggedIn
        ? activeLayout?.hasOrganizerBand
          ? structure?.header?.loggedIn
          : structure?.header?.loggedInMeta
        : structure?.header?.loggedOut,
    [user?.isLoggedIn, structure?.header, activeLayout?.hasOrganizerBand]
  );

  const isEntryPage = useMemo(
    () => router?.pathname === '/[organizer]/[category]/[id]/[sub]',
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

  useEffect(() => {
    if (organizer?.error && activeRoute !== Routes.error) {
      router.replace(
        routes.error({
          locale,
        })
      );
    }
  }, [activeRoute, locale, organizer?.error, router]);

  const headerTitle =
    appLayouts[layout].hasOrganizerBand && organizer?.data
      ? getTranslation(language, organizer.data.relations?.translations)?.attributes.name ||
        (t('general.defaultTitleOrganizer') as string)
      : title;

  const renderedHeaderMain = (
    <HeaderMain
      user={user}
      title={headerTitle}
      Link={Link}
      menuItems={activeHeader.menuItems}
      layout={layout}
      disabled={user?.isLoggedIn && organizerId === defaultOrganizerId}
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
