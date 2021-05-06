import { Story } from '@storybook/react';
import React from 'react';
import styled from '@emotion/styled';

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

const StyledTestContent = styled.div`
  width: 100%;
  display: grid;
  padding: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1.5rem;
  column-gap: 1.5rem;
`;

const StyledTestContentBox = styled.div`
  height: 20rem;
  width: 100%;
  border: 1px solid var(--grey-400);
  padding: 1.5rem;
  font-weight: 700;
  border-radius: 0.75rem;
`;

export const NavigationStory: Story = () => {
  const mainMenu = useMainMenu(testMenuStructure, 'Kulturdaten.Berlin', TestLink);

  return (
    <AppLayout
      mainMenu={mainMenu}
      content={
        <StyledTestContent>
          {[...Array(10)].map((i, index) => (
            <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
          ))}
        </StyledTestContent>
      }
      titleBar={<TitleBar title="Page Title" />}
    />
  );
};
NavigationStory.storyName = 'Navigation complete';

export const HeaderStory: Story = () => <Header title="Kulturdaten.Berlin" Link={TestLink} />;
HeaderStory.storyName = 'Header';

const testMenuStructure = [
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
    ],
  },
  {
    actions: [
      {
        type: MenuAction.button,
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
];

export const MainMenuStory: Story = () => {
  const mainMenu = useMainMenu(testMenuStructure, 'Kulturdaten.Berlin', TestLink);

  return mainMenu;
};
MainMenuStory.storyName = 'Main Menu';

export const TitleBarStory: Story = () => <TitleBar title="Page Title" />;
TitleBarStory.storyName = 'Title Bar';
