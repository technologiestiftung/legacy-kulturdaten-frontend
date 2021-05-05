import Link from 'next/link';
import React, { ReactNode, useContext } from 'react';
import { useT } from '../../lib/i18n';
import { routes, useLocale } from '../../lib/routing';
import { AppLayout } from '../layouts/AppLayout';
import { MenuAction, useMainMenu } from '../navigation/mainMenu/MainMenu';
import { MenuIconName } from '../navigation/MenuIcon';
import { NavigationContext } from '../navigation/NavigationContext';
import { TitleBarProps } from '../navigation/TitleBar';

import { useUser } from '../user/useUser';

const UseUser: React.FC = () => {
  useUser();
  return null;
};

const MenuTitleLink: React.FC<{ content: React.ReactElement }> = ({
  content,
}: {
  content: React.ReactElement;
}) => {
  const locale = useLocale();
  const { setMainMenuOpen } = useContext(NavigationContext);

  return (
    <Link href={routes.dashboard({ locale })} passHref>
      {React.cloneElement(content, { onClick: () => setMainMenuOpen(false) })}
    </Link>
  );
};

interface AppWrapperProps {
  children: ReactNode;
  titleBar?: React.ReactElement<TitleBarProps>;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, titleBar }: AppWrapperProps) => {
  const locale = useLocale();
  const { logout } = useUser();
  const t = useT();

  const mainMenu = useMainMenu(
    [
      {
        title: t('menu.start.title') as string,
        icon: MenuIconName.start,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: t('menu.start.actions.dashboard') as string,
              href: routes.dashboard({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: t('menu.start.actions.notifications') as string,
              href: routes.userNotifications({ locale }),
            },
          },
        ],
      },
      {
        title: t('menu.organizers.title') as string,
        icon: MenuIconName.organizer,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: t('menu.organizers.actions.all') as string,
              href: routes.organizers({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: t('menu.organizers.actions.my') as string,
              href: routes.organizer({
                locale,
                query: {
                  entry: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: t('menu.offers.title') as string,
        icon: MenuIconName.offer,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: t('menu.offers.actions.all') as string,
              href: routes.offers({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: t('menu.offers.actions.my') as string,
              href: routes.offer({
                locale,
                query: {
                  entry: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: t('menu.locations.title') as string,
        icon: MenuIconName.location,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: t('menu.locations.actions.all') as string,
              href: routes.locations({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: t('menu.locations.actions.my') as string,
              href: routes.location({
                locale,
                query: {
                  entry: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: t('menu.user.title') as string,
        icon: MenuIconName.user,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: t('menu.user.actions.profile') as string,
              href: routes.userProfile({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: t('menu.user.actions.settings') as string,
              href: routes.userSettings({ locale }),
            },
          },
          {
            type: MenuAction.button,
            action: {
              title: t('menu.user.actions.logout') as string,
              call: () => {
                logout();
              },
            },
          },
        ],
      },
    ],
    t('menu.title') as string,
    MenuTitleLink
  );

  return (
    <>
      <UseUser />
      <AppLayout mainMenu={mainMenu} content={children} titleBar={titleBar} />
    </>
  );
};
