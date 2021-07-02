import { useT } from '../lib/i18n';
import { routes, useLocale } from '../lib/routing';
import { MenuItem, MenuStructure } from '../components/navigation/mainMenu/MainMenu';
import { MenuIconName } from '../components/navigation/mainMenu/MenuIcon';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';
import { OrganizerTable } from '../components/pages/organizer/list';
import { Button, ButtonColor, ButtonVariant } from '../components/button';
import Link from 'next/link';
import { useContext } from 'react';
import { NavigationContext } from '../components/navigation/NavigationContext';
import { ButtonLink } from '../components/button/ButtonLink';

export const useAppTitle = (): string => {
  const t = useT();

  return t('menu.title') as string;
};

export const useMenuStructure = (): MenuStructure => {
  const t = useT();
  const locale = useLocale();
  const { logout } = useUser();
  const { setMainMenuOpen } = useContext(NavigationContext);

  return {
    defaultMenuKey: 'main',
    menus: [
      {
        key: 'main',
        expandable: false,
        subMenus: [
          {
            title: t('menu.start.title') as string,
            icon: MenuIconName.start,
            items: [
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.start.items.dashboard') as string,
                  href: routes.dashboard({ locale }),
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.start.items.notifications') as string,
                  href: routes.userNotifications({ locale }),
                },
              },
            ],
          },
          {
            title: t('menu.offer.title') as string,
            headOptions: {
              background: 'var(--blue)',
              color: 'var(--white)',
              uppercase: true,
            },
            button: (
              <Link href={routes.createOffer({ locale })}>
                <ButtonLink variant={ButtonVariant.minimal} onClick={() => setMainMenuOpen(false)}>
                  {t('menu.offer.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItem.folder,
                action: {
                  label: t('menu.offer.items.overview') as string,
                  menuKey: 'offer',
                },
              },
            ],
          },
          {
            title: t('menu.organizer.title') as string,
            headOptions: {
              background: '#B01E1E',
              color: 'var(--white)',
              uppercase: true,
            },
            button: (
              <Link href={routes.createOrganizer({ locale })}>
                <ButtonLink variant={ButtonVariant.minimal} onClick={() => setMainMenuOpen(false)}>
                  {t('menu.organizer.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItem.folder,
                action: {
                  label: t('menu.organizer.items.overview') as string,
                  menuKey: 'organizer',
                },
              },
            ],
          },
          {
            title: t('menu.location.title') as string,
            headOptions: {
              background: 'var(--green-mid)',
              color: 'var(--white)',
              uppercase: true,
            },
            button: (
              <Link href={routes.createLocation({ locale })}>
                <ButtonLink variant={ButtonVariant.minimal} onClick={() => setMainMenuOpen(false)}>
                  {t('menu.location.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItem.folder,
                action: {
                  label: t('menu.location.items.overview') as string,
                  menuKey: 'location',
                },
              },
            ],
          },
          {
            title: t('menu.user.title') as string,
            icon: MenuIconName.user,
            items: [
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.user.items.profile') as string,
                  href: routes.userProfile({ locale }),
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.user.items.settings') as string,
                  href: routes.userSettings({ locale }),
                },
              },
            ],
            button: (
              <Button onClick={() => logout()} variant={ButtonVariant.minimal} icon="LogOut">
                {t('menu.user.items.logout')}
              </Button>
            ),
          },
        ],
      },
      {
        key: 'offer',
        expandable: true,
        List: ListPlaceholder,
      },
      {
        key: 'organizer',
        expandable: true,
        List: OrganizerTable,
      },
      {
        key: 'location',
        expandable: true,
        List: ListPlaceholder,
      },
    ],
  };
};

const ListPlaceholder: React.FC = () => <div>TBD</div>;
