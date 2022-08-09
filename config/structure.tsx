import Link from 'next/link';

import { useT } from '../lib/i18n';
import { routes, useLocale } from '../lib/routing';
import { NavigationStructure } from '../components/navigation';
import { MenuIconName } from '../components/navigation/Menu/MenuIcon';
import { useUser } from '../components/user/useUser';
import { Button, ButtonVariant } from '../components/button';
import { ButtonLink } from '../components/button/ButtonLink';
import { MenuItemType } from '../components/navigation/Menu';
import { OrganizerList } from '../components/EntryList/OrganizerList';
import { LocationList } from '../components/EntryList/LocationList';
import { LocaleSwitch } from '../components/navigation/LocaleSwitch';
import { OfferList } from '../components/EntryList/OfferList';
import { useRouter } from 'next/router';
import { useOrganizerId } from '../lib/useOrganizer';
import { defaultOrganizerId } from '../components/navigation/NavigationContext';
import { useContext } from 'react';
import { UserContext } from '../components/user/UserContext';
import { sidebarRef } from './categories';

export const useAppTitle = (): string => {
  const t = useT();

  return t('menu.title') as string;
};

export const useMenuStructure = (): NavigationStructure => {
  const t = useT();
  const locale = useLocale();
  const { logout } = useUser();
  const router = useRouter();
  const organizerId = useOrganizerId();
  const { userInactive } = useContext(UserContext);

  const focusSidebar = () => {
    setTimeout(() => {
      sidebarRef.current.focus()
    },300)
  }

  return {
    header: {
      loggedOut: {
        menuItems: [
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.start.items.login') as string,
              href: routes.login({ locale }),
            },
          },
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.start.items.registration') as string,
              href: routes.register({ locale }),
            },
          },
        ],
      },
      loggedInMeta: {
        menuItems: [
          {
            type: MenuItemType.link,
            disabled: userInactive,
            action: {
              title: t('menu.start.items.back') as string,
              href: routes.dashboard({
                locale,
                query: { organizer: organizerId || defaultOrganizerId },
              }),
            },
          },
        ],
      },
      loggedIn: {
        menuItems: [
          {
            type: MenuItemType.link,
            disabled: false,
            action: {
              title: t('menu.start.items.dashboard') as string,
              href: routes.dashboard({
                locale,
                query: { organizer: organizerId || defaultOrganizerId },
              }),
            },
          },
          {
            type: MenuItemType.divider,
          },
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.offer.title') as string,
              href: routes.offer({ query: { organizer: organizerId }, locale }),
              active: router.asPath.includes(
                routes.offer({ query: { organizer: organizerId }, locale })
              ),
              onClick: focusSidebar
            },
          },
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.location.title') as string,
              href: routes.location({ query: { organizer: organizerId }, locale }),
              active: router.asPath.includes(
                routes.location({ query: { organizer: organizerId }, locale })
              ),
              onClick: focusSidebar
            },
          },
          {
            type: MenuItemType.divider,
          },
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.start.items.team') as string,
              href: routes.team({ locale, query: { organizer: organizerId } }),
            },
          },
          {
            type: MenuItemType.link,
            action: {
              title: t('menu.start.items.profile') as string,
              href: routes.organizer({ locale, query: { organizer: organizerId, sub: 'info' } }),
              active: router.asPath.includes(
                routes.organizer({ query: { organizer: organizerId }, locale })
              ),
            },
          },
        ],
      },
    },
    menus: [
      {
        key: 'main',
        title: t('menu.main') as string,
        expandable: false,
        sections: [
          {
            title: t('menu.start.title') as string,
            icon: MenuIconName.start,
            items: [
              {
                type: MenuItemType.link,
                action: {
                  title: t('menu.start.items.dashboard') as string,
                  href: routes.dashboard({ locale, query: { organizer: organizerId } }),
                },
              },
              {
                type: MenuItemType.link,
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
              <Link
                href={routes.createOffer({ query: { organizer: organizerId }, locale })}
                passHref
              >
                <ButtonLink variant={ButtonVariant.minimal}>
                  {t('menu.offer.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItemType.folder,
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
              background: 'var(--red)',
              color: 'var(--white)',
              uppercase: true,
            },
            button: (
              <Link
                href={routes.createOrganizer({ query: { organizer: organizerId }, locale })}
                passHref
              >
                <ButtonLink variant={ButtonVariant.minimal}>
                  {t('menu.organizer.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItemType.folder,
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
              <Link
                href={routes.createLocation({ query: { organizer: organizerId }, locale })}
                passHref
              >
                <ButtonLink variant={ButtonVariant.minimal}>
                  {t('menu.location.items.create')}
                </ButtonLink>
              </Link>
            ),
            items: [
              {
                type: MenuItemType.folder,
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
                type: MenuItemType.link,
                action: {
                  title: t('menu.user.items.profile') as string,
                  href: routes.userProfile({ locale }),
                },
              },
              {
                type: MenuItemType.link,
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
        AdditionalContent: LocaleSwitch,
      },
      {
        key: 'offer',
        title: t('menu.offer.title') as string,
        expandable: true,
        List: OfferList,
      },
      {
        key: 'organizer',
        title: t('menu.organizer.title') as string,
        expandable: true,
        List: OrganizerList,
      },
      {
        key: 'location',
        title: t('menu.location.title') as string,
        expandable: true,
        List: LocationList,
      },
    ],
  };
};
