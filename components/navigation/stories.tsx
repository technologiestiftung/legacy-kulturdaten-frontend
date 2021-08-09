import { Story } from '@storybook/react';
import React from 'react';
import styled from '@emotion/styled';

import { Header } from './header/Header';
import { NavigationStructure, useNavigation } from '.';
import { MenuIconName } from './Menu/MenuIcon';
import { AppLayout } from '../layouts/AppLayout';
import { TitleBar } from './TitleBar';
import { HeaderLinkProps } from './header/HeaderLink';
import { Button, ButtonColor, ButtonVariant } from '../button';
import { MenuItemType } from './Menu';

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

const testMenuStructure: NavigationStructure = {
  defaultMenuKey: 'main',
  menus: [
    {
      key: 'main',
      title: 'Hauptmenü',
      expandable: false,
      sections: [
        {
          title: 'Start',
          icon: MenuIconName.start,
          items: [
            {
              type: MenuItemType.link,
              action: {
                title: 'Dashboard',
                href: '#',
                active: false,
              },
            },
            {
              type: MenuItemType.link,
              action: {
                title: 'Benachrichtigungen',
                href: '#',
              },
            },
          ],
        },
        {
          title: 'Angebote',
          headOptions: {
            background: 'var(--blue)',
            color: 'var(--white)',
            uppercase: true,
          },
          button: (
            <Button variant={ButtonVariant.minimal} color={ButtonColor.black}>
              erstellen
            </Button>
          ),
          items: [
            {
              type: MenuItemType.folder,
              action: {
                label: 'Alle Angebote',
                menuKey: 'offer',
              },
            },
          ],
        },
        {
          title: 'Anbieter:innen',
          headOptions: {
            background: '#B01E1E',
            color: 'var(--white)',
            uppercase: true,
          },
          button: (
            <Button variant={ButtonVariant.minimal} color={ButtonColor.black}>
              erstellen
            </Button>
          ),
          items: [
            {
              type: MenuItemType.folder,
              action: {
                label: 'Alle Anbieter:innen',
                menuKey: 'organizer',
              },
            },
          ],
        },
        {
          title: 'Orte',
          headOptions: {
            background: 'var(--green-mid)',
            color: 'var(--white)',
            uppercase: true,
          },
          button: (
            <Button variant={ButtonVariant.minimal} color={ButtonColor.black}>
              erstellen
            </Button>
          ),
          items: [
            {
              type: MenuItemType.folder,
              action: {
                label: 'Alle Orte',
                menuKey: 'location',
              },
            },
          ],
        },
        {
          title: 'Nutzer:in',
          icon: MenuIconName.user,
          button: (
            <Button variant={ButtonVariant.minimal} color={ButtonColor.black} icon="LogOut">
              abmelden
            </Button>
          ),
          items: [
            {
              type: MenuItemType.link,
              action: {
                title: 'Mein Profil',
                href: '#',
              },
            },
            {
              type: MenuItemType.link,
              action: {
                title: 'Meine Einstellungen',
                href: '#',
              },
            },
          ],
        },
      ],
    },
    {
      key: 'offer',
      title: 'Angebote',
      expandable: true,
      sections: [
        {
          title: 'Test',
          icon: MenuIconName.start,
          items: [
            {
              type: MenuItemType.link,
              action: {
                title: 'Dashboard',
                href: '#',
                active: true,
              },
            },
            {
              type: MenuItemType.link,
              action: {
                title: 'Benachrichtigungen',
                href: '#',
              },
            },
          ],
        },
      ],
    },
    {
      key: 'organizer',
      title: 'Anbieter:innen',
      expandable: true,
      sections: [
        {
          title: 'Test',
          icon: MenuIconName.start,
          items: [
            {
              type: MenuItemType.link,
              action: {
                title: 'Dashboard',
                href: '#',
                active: true,
              },
            },
            {
              type: MenuItemType.link,
              action: {
                title: 'Benachrichtigungen',
                href: '#',
              },
            },
          ],
        },
      ],
    },
    {
      key: 'location',
      title: 'Orte',
      expandable: true,
      sections: [
        {
          title: 'Test',
          icon: MenuIconName.start,
          items: [
            {
              type: MenuItemType.link,
              action: {
                title: 'Dashboard',
                href: '#',
                active: true,
              },
            },
            {
              type: MenuItemType.link,
              action: {
                title: 'Benachrichtigungen',
                href: '#',
              },
            },
          ],
        },
      ],
    },
  ],
};

const X: React.FC = () => {
  const navigation = useNavigation(testMenuStructure, 'Kulturdaten.Berlin', TestLink);

  return (
    <AppLayout
      navigation={navigation}
      content={
        <StyledTestContent>
          {[...Array(10)].map((i, index) => (
            <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
          ))}
        </StyledTestContent>
      }
    />
  );
};

export const NavigationStory: Story = () => <X />;
NavigationStory.storyName = 'Navigation complete';

export const HeaderStory: Story = () => (
  <Header activeMenuTitle="main" defaultMenuKey="main" title="Kulturdaten.Berlin" Link={TestLink} />
);
HeaderStory.storyName = 'Header';

export const MainMenuStory: Story = () => {
  const navigation = useNavigation(testMenuStructure, 'Kulturdaten.Berlin', TestLink);

  return navigation;
};
MainMenuStory.storyName = 'Main Menu';

export const TitleBarStory: Story = () => <TitleBar title="Page Title" />;
TitleBarStory.storyName = 'Title Bar';
