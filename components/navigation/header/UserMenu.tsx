import { useMemo } from 'react';
import { routes } from '../../../config/routes';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { Breakpoint, useBreakpointOrWider } from '../../../lib/WindowService';
import { useAdminMode } from '../../Admin/AdminContext';
import { Button, ButtonColor, ButtonVariant } from '../../button';
import { DropdownMenu, DropdownMenuButtonColor, DropdownMenuText } from '../../DropdownMenu';
import { appLayouts, useLayout } from '../../layouts/AppLayout';
import { useUser, WrappedUser } from '../../user/useUser';
import { HeaderMenuLink } from './HeaderMenuLink';

interface UserMenuProps {
  user: WrappedUser;
}

export const UserMenu: React.FC<UserMenuProps> = () => {
  const { logout, user, isSuperuser } = useUser();
  const t = useT();
  const locale = useLocale();
  const { adminModeActive } = useAdminMode();
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const layout = useLayout();

  const hasOrganizerBand = useMemo(() => appLayouts[layout].hasOrganizerBand, [layout]);

  return (
    <DropdownMenu
      icon="User"
      buttonAriaLabels={{
        open: t('userMenu.ariaLabelOpen') as string,
        close: t('userMenu.ariaLabelClose') as string,
      }}
      buttonColor={
        !isMidOrWider && hasOrganizerBand && adminModeActive
          ? DropdownMenuButtonColor.white
          : DropdownMenuButtonColor.black
      }
    >
      <DropdownMenuText>
        {t('userMenu.loggedIn')}: <b>{user?.attributes?.email}</b>
      </DropdownMenuText>
      <HeaderMenuLink
        href={routes.userSettings({ locale })}
        title={t('userMenu.settings') as string}
        icon="Sliders"
      />
      {isSuperuser && (
        <HeaderMenuLink
          href={routes.admin({ locale })}
          title={t('userMenu.admin') as string}
          icon="Eye"
        />
      )}
      <Button
        variant={ButtonVariant.minimal}
        color={ButtonColor.white}
        icon="LogOut"
        onClick={logout}
      >
        {t('userMenu.logOut')}
      </Button>
    </DropdownMenu>
  );
};
