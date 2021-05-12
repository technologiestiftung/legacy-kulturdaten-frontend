import { useT } from '../lib/i18n';
import { routes, useLocale } from '../lib/routing';
import { MenuItem, MenuStructure } from '../components/navigation/mainMenu/MainMenu';
import { MenuIconName } from '../components/navigation/mainMenu/MenuIcon';
import { useUser } from '../components/user/useUser';
import { useRouter } from 'next/router';
import { Categories } from './categories';

export const useAppTitle = (): string => {
  const t = useT();

  return t('menu.title') as string;
};

export const useMenuStructure = (): MenuStructure => {
  const t = useT();
  const locale = useLocale();
  const { logout } = useUser();
  const router = useRouter();

  return [
    {
      title: t('menu.start.title') as string,
      icon: MenuIconName.start,
      isActive:
        router.asPath === routes.dashboard({ locale }) ||
        router.asPath === routes.userNotifications({ locale }),
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
      title: t('menu.organizer.title') as string,
      icon: MenuIconName.organizer,
      isActive: router.query?.category === Categories.organizer,
      items: [
        {
          type: MenuItem.link,
          action: {
            title: t('menu.organizer.items.all') as string,
            href: routes.organizer({ locale }),
          },
        },
        {
          type: MenuItem.link,
          action: {
            title: t('menu.organizer.items.my') as string,
            href: routes.organizer({
              locale,
              query: {
                entry: '1',
              },
            }),
          },
        },
      ],
    },
    {
      title: t('menu.offer.title') as string,
      icon: MenuIconName.offer,
      isActive: router.query?.category === Categories.offer,
      items: [
        {
          type: MenuItem.link,
          action: {
            title: t('menu.offer.items.all') as string,
            href: routes.offer({ locale }),
          },
        },
        {
          type: MenuItem.link,
          action: {
            title: t('menu.offer.items.my') as string,
            href: routes.offer({
              locale,
              query: {
                entry: '1',
              },
            }),
          },
        },
      ],
    },
    {
      title: t('menu.location.title') as string,
      icon: MenuIconName.location,
      isActive: router.query?.category === Categories.location,
      items: [
        {
          type: MenuItem.link,
          action: {
            title: t('menu.location.items.all') as string,
            href: routes.location({ locale }),
          },
        },
        {
          type: MenuItem.link,
          action: {
            title: t('menu.location.items.my') as string,
            href: routes.location({
              locale,
              query: {
                entry: '1',
              },
            }),
          },
        },
      ],
    },
    {
      title: t('menu.user.title') as string,
      icon: MenuIconName.user,
      isActive:
        router.asPath === routes.userProfile({ locale }) ||
        router.asPath === routes.userSettings({ locale }),
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
  ];
};
