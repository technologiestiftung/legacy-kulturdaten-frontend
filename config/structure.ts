import { useT } from '../lib/i18n';
import { routes, useLocale } from '../lib/routing';
import { MenuItem, MenuStructure } from '../components/navigation/mainMenu/MainMenu';
import { MenuIconName } from '../components/navigation/mainMenu/MenuIcon';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';
import { OrganizerTable } from '../components/pages/organizer/list';

export const useAppTitle = (): string => {
  const t = useT();

  return t('menu.title') as string;
};

export const useMenuStructure = (): MenuStructure => {
  const t = useT();
  const locale = useLocale();
  const { logout } = useUser();

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
            items: [
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.offer.items.overview') as string,
                  href: routes.offer({ locale }),
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.offer.items.create') as string,
                  href: routes.createOffer({
                    locale,
                  }),
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
            items: [
              {
                type: MenuItem.folder,
                action: {
                  label: t('menu.organizer.items.overview') as string,
                  menuKey: 'organizer',
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.organizer.items.overview') as string,
                  href: routes.organizer({ locale }),
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.organizer.items.create') as string,
                  href: routes.createOrganizer({
                    locale,
                  }),
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
            items: [
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.location.items.overview') as string,
                  href: routes.location({ locale }),
                },
              },
              {
                type: MenuItem.link,
                action: {
                  title: t('menu.location.items.create') as string,
                  href: routes.createLocation({
                    locale,
                  }),
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
              {
                type: MenuItem.divider,
              },
              {
                type: MenuItem.button,
                action: {
                  label: t('menu.user.items.logout') as string,
                  icon: 'LogOut',
                  onClick: () => {
                    logout();
                  },
                },
              },
            ],
          },
        ],
      },
      {
        key: 'organizer',
        expandable: true,
        List: OrganizerTable,
      },
    ],
  };
};
