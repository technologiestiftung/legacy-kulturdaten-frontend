import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useMemo, useRef, useState } from 'react';
import { User, X } from 'react-feather';
import { routes } from '../../../config/routes';
import { useT } from '../../../lib/i18n';
import { useLocale } from '../../../lib/routing';
import { Breakpoint } from '../../../lib/WindowService';
import { Button, ButtonColor, ButtonVariant } from '../../button';
import { mq } from '../../globals/Constants';
import { useUser, WrappedUser } from '../../user/useUser';
import { HeaderMenuLink } from './HeaderMenuLink';

const StyledUserMenu = styled.div``;

const StyledUserMenuButton = styled.button<{ visible: boolean }>`
  appearance: none;
  border: none;
  background: var(--black);
  display: block;
  color: var(--white);
  padding: 0.5625rem;
  border-radius: 2rem;
  margin: 0;
  line-height: 0;
  box-shadow: 0.125rem 0.125rem 0.75rem -0.125rem rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform: translateY(0);
  transition: transform var(--transition-duration);
  position: relative;
  z-index: 2;

  ${({ visible }) =>
    visible
      ? css`
          transform: translateY(0.375rem);

          &:hover {
            transform: translateY(0.375rem);
          }
        `
      : ''}

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const StyledUserMenuDropdown = styled.div<{ visible: boolean; animating: boolean }>`
  background: var(--grey-200);
  border: 1px solid var(--grey-400);
  border-radius: 1.125rem;
  width: calc(var(--app-width) - 1.5rem);
  position: absolute;
  right: 0.75rem;
  transition: opacity var(--transition-duration), transform var(--transition-duration);
  transform: translate(0rem, -1rem);
  opacity: 0;
  box-shadow: 0.125rem 0.125rem 3rem -0.25rem rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;

  ${mq(Breakpoint.mid)} {
    right: 1.5rem;
    width: auto;
    min-width: 18rem;
  }

  ${({ animating }) =>
    animating
      ? css`
          visibility: visible;
          display: block;
        `
      : ''}

  ${({ visible }) =>
    visible
      ? css`
          transform: translate(0, 0);
          opacity: 1;
          display: block;
          visibility: visible;
        `
      : ''}
`;

const StyledUserMenuDropdownContent = styled.div`
  padding: 0.75rem;
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);

  b {
    font-weight: 700;
  }
`;

const StyledUserMenuDropdownText = styled.div`
  word-break: break-all;
`;

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
      if (!userMenuRef.current.contains(e.target as Node)) {
        clickHandler(false);
      }
    };
    document?.body.addEventListener('click', handle);

    return () => {
      document?.body.removeEventListener('click', handle);
    };
  }, [clickHandler]);

  return (
    <StyledUserMenu ref={userMenuRef}>
      <StyledUserMenuButton
        onClick={() => clickHandler()}
        visible={visible}
        aria-label={
          visible
            ? (t('userMenu.ariaLabelClose') as string)
            : (t('userMenu.ariaLabelOpen') as string)
        }
      >
        {visible ? <X /> : <User />}
      </StyledUserMenuButton>
      <StyledUserMenuDropdown visible={visible} animating={animating}>
        <StyledUserMenuDropdownContent>
          <StyledUserMenuDropdownText>
            {t('userMenu.loggedIn')}: <b>{user.email}</b>
          </StyledUserMenuDropdownText>
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
        </StyledUserMenuDropdownContent>
      </StyledUserMenuDropdown>
    </StyledUserMenu>
  );
};
