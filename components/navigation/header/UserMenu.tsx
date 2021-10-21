import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { logout, user } = useUser();
  const t = useT();
  const locale = useLocale();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const clickHandler = useMemo(
    () => (manualVisible?: boolean) => {
      if (!animating) {
        setAnimating(true);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setVisible(typeof manualVisible !== 'undefined' ? manualVisible : !visible);

            setTimeout(() => setAnimating(false), 100);
          });
        });
      }
    },
    [animating, visible]
  );

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if ((visible || animating) && !userMenuRef.current.contains(e.target as Node)) {
        clickHandler(false);
      }
    };

    document?.body.addEventListener('click', handle);

    return () => {
      document?.body.removeEventListener('click', handle);
    };
  }, [visible, animating, clickHandler]);

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
        onClick={() => clickHandler(false)}
      />
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
