import { Story } from '@storybook/react';
import React from 'react';
import { Header } from './Header';
import { MenuIconName, useMainMenu } from './MainMenu';

export default {
  title: 'Navigation',
};

const TestLink: React.FC<{ content: React.ReactElement }> = ({
  content,
}: {
  content: React.ReactElement;
}) => <>{React.cloneElement(content, { href: '#' })}</>;

export const HeaderStory: Story = () => <Header title="Kulturdaten.Berlin" Link={TestLink} />;
HeaderStory.storyName = 'Header';

export const MainMenuStory: Story = () => {
  const [mainMenu] = useMainMenu(
    [
      {
        title: 'Start',
        icon: MenuIconName.start,
        links: [
          {
            title: 'Dashboard',
            href: '#',
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
            active: true,
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

  return mainMenu;
};
