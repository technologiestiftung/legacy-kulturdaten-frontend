import { Story } from '@storybook/react';
import React from 'react';
import styled from '@emotion/styled';

import { Header } from './header/Header';
import { MenuItem, useMainMenu } from './mainMenu/MainMenu';
import { MenuIconName } from './mainMenu/MenuIcon';
import { AppLayout } from '../layouts/AppLayout';
import { TitleBar } from './TitleBar';
import { HeaderLinkProps } from './header/HeaderLink';

export default {
  title: 'Navigation',
};

const TestLink: React.FC<HeaderLinkProps> = ({ children }: { children: React.ReactElement }) => (
  <>{React.cloneElement(children, { href: '#' })}</>
);

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
    ],
  },
  {
    items: [
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
];

export const MainMenuStory: Story = () => {
  const mainMenu = useMainMenu(testMenuStructure, 'Kulturdaten.Berlin', TestLink);

  return mainMenu;
};
MainMenuStory.storyName = 'Main Menu';

export const TitleBarStory: Story = () => <TitleBar title="Page Title" />;
TitleBarStory.storyName = 'Title Bar';
