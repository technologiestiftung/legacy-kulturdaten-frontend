import { routes } from '../../../config/routes';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { Button, ButtonColor, ButtonVariant } from '../../button';
import { DropdownMenu, DropdownMenuText } from '../../DropdownMenu';
import { useUser, WrappedUser } from '../../user/useUser';
import { HeaderMenuLink } from './HeaderMenuLink';

interface UserMenuProps {
  user: WrappedUser;
}

export const UserMenu: React.FC<UserMenuProps> = () => {
  const { logout, user, isSuperuser } = useUser();
  const t = useT();
  const locale = useLocale();

  return (
    <DropdownMenu
      icon="User"
      buttonAriaLabels={{
        open: t('userMenu.ariaLabelOpen') as string,
        close: t('userMenu.ariaLabelClose') as string,
      }}
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
