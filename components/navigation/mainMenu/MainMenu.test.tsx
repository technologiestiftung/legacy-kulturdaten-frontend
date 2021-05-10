import { render } from '../../../lib/test-utils';
import { MenuItem, useMainMenu } from './MainMenu';
import { MenuIconName } from './MenuIcon';
import { HeaderLink } from '../header/HeaderLink';
import React from 'react';

const testMenuStructure = [
  {
    title: 'Start',
    icon: MenuIconName.start,
    items: [
      {
        type: MenuItem.link,
        action: {
          title: 'Dashboard',
          href: '#',
          active: true,
        },
      },
      {
        type: MenuItem.link,
        action: {
          title: 'Benachrichtigungen',
          href: '#',
        },
      },
    ],
  },
  {
    title: 'Anbieter:innen',
    icon: MenuIconName.organizer,
    items: [
      {
        type: MenuItem.link,
        action: {
          title: 'Alle Anbieter:innen',
          href: '#',
        },
      },
      {
        type: MenuItem.link,
        action: {
          title: 'Meine Anbieter:innen',
          href: '#',
        },
      },
    ],
  },
  {
    title: 'Angebote',
    icon: MenuIconName.offer,
    items: [
      {
        type: MenuItem.link,
        action: {
          title: 'Alle Angebote',
          href: '#',
        },
      },
      {
        type: MenuItem.link,
        action: {
          title: 'Meine Angebote',
          href: '#',
        },
      },
    ],
  },
  {
    title: 'Orte',
    icon: MenuIconName.location,
    items: [
      {
        type: MenuItem.link,
        action: {
          title: 'Alle Orte',
          href: '#',
        },
      },
      {
        type: MenuItem.link,
        action: {
          title: 'Meine Orte',
          href: '#',
        },
      },
    ],
  },
  {
    title: 'Nutzer:in',
    icon: MenuIconName.user,
    items: [
      {
        type: MenuItem.link,
        action: {
          title: 'Mein Profil',
          href: '#',
        },
      },
      {
        type: MenuItem.link,
        action: {
          title: 'Meine Einstellungen',
          href: '#',
        },
      },
      {
        type: MenuItem.divider,
      },
      {
        type: MenuItem.button,
        action: {
          label: 'Abmelden',
          onClick: () => {
            //
          },
          icon: 'LogOut',
        },
      },
    ],
  },
  {
    items: [],
  },
];

const HookedMainMenu: React.FC = () => {
  const menu = useMainMenu(testMenuStructure, 'Test Title', HeaderLink);
  return menu;
};

test('MainMenu renders', () => {
  const { container } = render(
    <>
      <HookedMainMenu />
    </>
  );

  expect(container).toMatchSnapshot();
});
