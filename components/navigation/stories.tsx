import { Story } from '@storybook/react';
import React from 'react';
import { Header } from './header/Header';
import { MenuAction, useMainMenu } from './mainMenu/MainMenu';
import { MenuIconName } from './MenuIcon';
import { AppLayout } from '../layouts/AppLayout';
import { TitleBar } from './TitleBar';

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
              href: '#',
              active: true,
            },
          },
          {
            type: MenuAction.link,
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
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Anbieter:innen',
              href: '#',
            },
          },
          {
            type: MenuAction.link,
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
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Angebote',
              href: '#',
            },
          },
          {
            type: MenuAction.link,
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
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Alle Orte',
              href: '#',
            },
          },
          {
            type: MenuAction.link,
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
        actions: [
          {
            type: MenuAction.link,
            action: {
              title: 'Mein Profil',
              href: '#',
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Meine Einstellungen',
              href: '#',
            },
          },
          {
            type: MenuAction.link,
            action: {
              title: 'Abmelden',
              href: '#',
            },
          },
        ],
      },
    ],
    'Kulturdaten.Berlin',
    TestLink
  );

  return (
    <AppLayout
      mainMenu={mainMenu}
      content={
        <div>
          Content Content Content Content Content Content Content Content Content Content Content
          Content Content Content Content Content Content Content Content Content{' '}
        </div>
      }
      titleBar={<div>Page title</div>}
    />
  );
};

export const TitleBarStory: Story = () => <TitleBar title="Page Title" />;
