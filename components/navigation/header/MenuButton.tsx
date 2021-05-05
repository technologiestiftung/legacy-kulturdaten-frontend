import styled from '@emotion/styled';
import { MouseEventHandler } from 'react';

import { useT } from '../../../lib/i18n';

interface SVGProps {
  state: MenuButtonState;
}

const SVG: React.FC<SVGProps> = ({ state }: SVGProps) => {
  const t = useT();

  return (
    <svg
      aria-labelledby="menu-button-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="menu-button-icon">
        {state === MenuButtonState.open ? t('menu.button.open') : t('menu.button.close')}
      </title>
      <g>
        <path d="M5 8H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <path d="M19 16H5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

const StyledMenuButton = styled.button<{ state: MenuButtonState }>`
  appearance: none;
  border: none;
  background: none;
  height: 1.5rem;
  width: 1.5rem;
  padding: 0;
  margin: 0;
  display: block;
  cursor: pointer;

  svg {
    display: block;
    position: relative;

    g {
      stroke: var(--black);
      animation-duration: 0.125s;
      transition: transform
        ${({ state }) => (state === MenuButtonState.open ? '0.0625s 0.0625s' : '0.0625s')};

      path {
        transition: transform
          ${({ state }) => (state === MenuButtonState.open ? '0.0625s' : '0.0625s 0.0625s')};
      }
    }

    g:nth-of-type(1) {
      transform-origin: 50% calc(50% - (4 / 24 * 100%));
      transform: ${({ state }) =>
        state === MenuButtonState.open ? 'translateY(0)' : 'translateY(calc(4 / 24 * 100%))'};

      path {
        transform-origin: 50% calc(50% - (4 / 24 * 100%));
        transform: ${({ state }) =>
          state === MenuButtonState.open ? 'rotateZ(0)' : 'rotateZ(45deg)'};
      }
    }

    g:nth-of-type(2) {
      transform-origin: 50% calc(50% + (4 / 24 * 100%));
      transform: ${({ state }) =>
        state === MenuButtonState.open ? 'translateY(0)' : 'translateY(calc(4 / 24 * -100%))'};

      path {
        transform-origin: 50% calc(50% + (4 / 24 * 100%));
        transform: ${({ state }) =>
          state === MenuButtonState.open ? 'rotateZ(0)' : 'rotateZ(-45deg)'};
      }
    }
  }
`;

export enum MenuButtonState {
  open = 'open',
  close = 'close',
}

interface MenuButtonProps {
  state: MenuButtonState;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  state = MenuButtonState.open,
  onClick,
}: MenuButtonProps) => {
  const t = useT();

  const description =
    state === MenuButtonState.open
      ? (t('menu.button.open') as string)
      : (t('menu.button.close') as string);

  return (
    <StyledMenuButton title={description} aria-label={description} state={state} onClick={onClick}>
      <SVG state={state} />
    </StyledMenuButton>
  );
};
