import Link from 'next/link';
import React, { ReactNode, useContext } from 'react';
import { routes, useLocale } from '../../lib/routing';
import { AppLayout } from '../layouts/AppLayout';
import { LocaleSwitch } from '../navigation/LocaleSwitch';
import { MenuAction, useMainMenu } from '../navigation/mainMenu/MainMenu';
import { MenuIconName } from '../navigation/MenuIcon';
import { NavigationContext } from '../navigation/NavigationContext';

import { useUser } from '../user/useUser';

interface AppWrapperProps {
  children: ReactNode;
}

const UseUser: React.FC = () => {
  useUser();
  return null;
};

const TestLink: React.FC<{ content: React.ReactElement }> = ({
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

export const AppWrapper: React.FC = ({ children }: AppWrapperProps) => {
  const locale = useLocale();
  const { logout } = useUser();

  const mainMenu = useMainMenu(
    [
      {
        title: 'Start',
        icon: MenuIconName.start,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Dashboard',
              href: routes.dashboard({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Benachrichtigungen',
              href: routes.userNotifications({ locale }),
            },
          },
        ],
      },
      {
        title: 'Anbieter:innen',
        icon: MenuIconName.organizer,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Anbieter:innen',
              href: routes.organizers({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Meine Anbieter:innen',
              href: routes.organizer({
                locale,
                query: {
                  id: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: 'Angebote',
        icon: MenuIconName.offer,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Angebote',
              href: routes.offers({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Meine Angebote',
              href: routes.offer({
                locale,
                query: {
                  id: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: 'Orte',
        icon: MenuIconName.location,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Orte',
              href: routes.locations({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Meine Orte',
              href: routes.location({
                locale,
                query: {
                  id: '1',
                },
              }),
            },
          },
        ],
      },
      {
        title: 'Nutzer:in',
        icon: MenuIconName.user,
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Mein Profil',
              href: routes.userProfile({ locale }),
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Meine Einstellungen',
              href: routes.userSettings({ locale }),
            },
          },
          {
            type: MenuAction.button,
            action: {
              title: 'Abmelden',
              call: () => {
                logout();
              },
            },
          },
        ],
      },
    ],
    'Kulturdaten.Berlin',
    TestLink
  );

  return (
    <>
      <UseUser />
      <AppLayout
        mainMenu={mainMenu}
        content={
          <>
            {children}
            <div>
              <LocaleSwitch />
            </div>
          </>
        }
        titleBar={<div>Page title</div>}
      />
    </>
  );
};
