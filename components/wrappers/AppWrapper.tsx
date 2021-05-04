import Link from 'next/link';
import React, { ReactNode } from 'react';
import { routes, useLocale } from '../../lib/routing';
import { AppLayout } from '../layouts/AppLayout';
import { LocaleSwitch } from '../navigation/LocaleSwitch';
import { useMainMenu } from '../navigation/mainMenu/MainMenu';
import { MenuIconName } from '../navigation/MenuIcon';

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

  return (
    <Link href={routes.dashboard({ locale })} passHref>
      {content}
    </Link>
  );
};

export const AppWrapper: React.FC = ({ children }: AppWrapperProps) => {
  const locale = useLocale();

  const mainMenu = useMainMenu(
    [
      {
        title: 'Start',
        icon: MenuIconName.start,
        links: [
          {
            title: 'Dashboard',
            href: routes.dashboard({ locale }),
          },
          {
            title: 'Benachrichtigungen',
            href: '#',
          },
        ],
      },
      {
        title: 'Anbieter:innen',
        icon: MenuIconName.organizer,
        links: [
          {
            title: 'Alle Anbieter:innen',
            href: '#',
          },
          {
            title: 'Meine Anbieter:innen',
            href: '#',
          },
        ],
      },
      {
        title: 'Angebote',
        icon: MenuIconName.offer,
        links: [
          {
            title: 'Alle Angebote',
            href: '#',
          },
          {
            title: 'Meine Angebote',
            href: '#',
          },
        ],
      },
      {
        title: 'Orte',
        icon: MenuIconName.location,
        links: [
          {
            title: 'Alle Orte',
            href: '#',
          },
          {
            title: 'Meine Orte',
            href: '#',
          },
        ],
      },
      {
        title: 'Nutzer:in',
        icon: MenuIconName.user,
        links: [
          {
            title: 'Mein Profil',
            href: routes.userProfile({ locale }),
          },
          {
            title: 'Meine Einstellungen',
            href: '#',
          },
          {
            title: 'Abmelden',
            href: '#',
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
