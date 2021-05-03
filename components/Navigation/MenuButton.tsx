import styled from '@emotion/styled';
import { MouseEventHandler } from 'react';

import { useT } from '../../lib/i18n';

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
      <path d="M5 8H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 16H5" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
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

  @keyframes topToClose {
    0% {
      transform: translateY(0) rotateZ(0deg);
    }
    50% {
      transform: translateY(calc(4 / 24 * 100%)) rotateZ(0deg);
    }
    100% {
      transform: translateY(calc(4 / 24 * 100%)) rotateZ(45deg);
    }
  }

  @keyframes topToOpen {
    0% {
      transform: translateY(calc(4 / 24 * 100%)) rotateZ(45deg);
    }
    50% {
      transform: translateY(calc(4 / 24 * 100%)) rotateZ(0deg);
    }
    100% {
      transform: translateY(0) rotateZ(0deg);
    }
  }

  @keyframes bottomToClose {
    0% {
      transform: translateY(0) rotateZ(0deg);
    }
    50% {
      transform: translateY(calc(4 / 24 * -100%)) rotateZ(0deg);
    }
    100% {
      transform: translateY(calc(4 / 24 * -100%)) rotateZ(-45deg);
    }
  }

  @keyframes bottomToOpen {
    0% {
      transform: translateY(calc(4 / 24 * -100%)) rotateZ(-45deg);
    }
    50% {
      transform: translateY(calc(4 / 24 * -100%)) rotateZ(0deg);
    }
    100% {
      transform: translateY(0) rotateZ(0deg);
    }
  }

  svg {
    display: block;
    position: relative;

    path {
      stroke: var(--black);
    }

    path:nth-of-type(1) {
      transform-origin: 50% calc(50% - (4 / 24 * 100%));
      animation-duration: 0.125s;
      animation-name: ${({ state }) =>
        state === MenuButtonState.open ? 'topToOpen' : 'topToClose'};
      transform: ${({ state }) =>
        state === MenuButtonState.open ? '' : 'translateY(calc(4 / 24 * 100%)) rotateZ(45deg)'};
    }

    path:nth-of-type(2) {
      transform-origin: 50% calc(50% + (4 / 24 * 100%));
      animation-duration: 0.125s;
      animation-name: ${({ state }) =>
        state === MenuButtonState.open ? 'bottomToOpen' : 'bottomToClose'};
      transform: ${({ state }) =>
        state === MenuButtonState.open ? '' : 'translateY(calc(4 / 24 * -100%)) rotateZ(-45deg)'};
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

  return (
    <StyledMenuButton
      title={
        state === MenuButtonState.open
          ? (t('menu.button.open') as string)
          : (t('menu.button.close') as string)
      }
      state={state}
      onClick={onClick}
    >
      <SVG state={state} />
    </StyledMenuButton>
  );
};
