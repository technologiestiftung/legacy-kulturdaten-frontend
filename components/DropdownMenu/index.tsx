import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as feather from 'react-feather';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

export enum DropdownMenuButtonColor {
  black = 'black',
  white = 'white',
  grey = 'grey',
}

const ButtonColors: {
  [key in DropdownMenuButtonColor]: {
    background: string;
    color: string;
  };
} = {
  black: {
    background: 'var(--black)',
    color: 'var(--white)',
  },
  white: {
    background: 'var(--white)',
    color: 'var(--black)',
  },
  grey: {
    background: 'var(--grey-200)',
    color: 'var(--black)',
  },
};

const StyledDropdownMenu = styled.div<{ stretch?: boolean }>`
  position: relative;

  ${({ stretch }) => stretch && 'width: 100%;'}
`;

const StyledDropdownMenuButton = styled.button<{
  visible: boolean;
  form?: DropdownMenuForm;
  stretch?: boolean;
  color: DropdownMenuButtonColor;
  size: DropdownMenuButtonSize;
}>`
  appearance: none;
  border: none;
  display: flex;
  column-gap: 0.75rem;
  border-radius: ${({ form }) => (form === DropdownMenuForm.round ? '2rem' : '0.75rem')};
  margin: 0;
  line-height: 0;
  box-shadow: 0.125rem 0.125rem 0.75rem -0.125rem rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transform: translateY(0);
  transition: transform var(--transition-duration);
  position: relative;
  z-index: 2;
  padding: 0;

  ${({ color }) => css`
    background: ${ButtonColors[color].background};
    color: ${ButtonColors[color].color};
  `}

  ${({ stretch }) =>
    stretch &&
    css`
      width: 100%;
      justify-content: space-between;
    `}

  ${({ visible }) =>
    visible
      ? css`
          transform: translateY(0.375rem);

          &:hover {
            transform: translateY(0.375rem);
          }
        `
      : ''}
`;

const StyledDropdownMenuButtonText = styled.span`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.375rem 0 0.375rem 1.125rem;
`;

const StyledDropdownMenuButtonIcon = styled.div<{
  hasText?: boolean;
  size: DropdownMenuButtonSize;
}>`
  line-height: 0;
  padding: ${({ hasText, size }) => {
    switch (size) {
      case DropdownMenuButtonSize.default: {
        return hasText ? '0.5625rem 1.125rem 0.5625rem 0' : '0.5625rem';
      }

      case DropdownMenuButtonSize.big: {
        return hasText ? '0.75rem 1.5rem 0.75rem 0' : '0.75rem';
      }

      default: {
        break;
      }
    }
  }};

  svg {
    width: ${({ size }) => (size === DropdownMenuButtonSize.big ? '1.5rem' : '1.125rem')};
    height: ${({ size }) => (size === DropdownMenuButtonSize.big ? '1.5rem' : '1.125rem')};
  }
`;

const StyledDropdownMenuDropdown = styled.div<{
  visible: boolean;
  animating: boolean;
  direction: DropdownMenuDirection;
  menuWidth?: string;
}>`
  color: var(--black);
  background: var(--grey-200);
  border-radius: 1.125rem;
  border-radius: 1.125rem;
  width: calc(var(--app-width) - 1.5rem);
  position: absolute;
  transition: opacity var(--transition-duration), transform var(--transition-duration);
  transform: translate(0rem, -1rem);
  opacity: 0;
  box-shadow: 0.125rem 0.125rem 3rem -0.25rem rgba(0, 0, 0, 0.5);
  display: none;
  visibility: hidden;
  z-index: 100002;

  ${({ direction }) => (direction === DropdownMenuDirection.left ? 'right: 0;' : 'left: 0;')}

  ${mq(Breakpoint.mid)} {
    width: auto;
    min-width: ${({ menuWidth }) => menuWidth || '18rem'};
    max-width: ${({ menuWidth }) => menuWidth || ''};
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

const StyledDropdownMenuDropdownContent = styled.div`
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

export const DropdownMenuText = styled.div`
  word-break: break-all;
`;

export enum DropdownMenuForm {
  round = 'round',
  rounded = 'rounded',
}

export enum DropdownMenuDirection {
  left = 'left',
  right = 'right',
}

export enum DropdownMenuButtonSize {
  default = 'default',
  big = 'big',
}

interface DropdownMenuProps {
  children: React.ReactNode;
  icon: string;
  buttonAriaLabels: {
    open: string;
    close: string;
  };
  text?: string;
  form?: DropdownMenuForm;
  stretch?: boolean;
  buttonColor?: DropdownMenuButtonColor;
  buttonSize?: DropdownMenuButtonSize;
  direction?: DropdownMenuDirection;
  menuWidth?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  icon,
  text,
  buttonAriaLabels,
  form = DropdownMenuForm.round,
  stretch,
  buttonColor = DropdownMenuButtonColor.black,
  buttonSize = DropdownMenuButtonSize.default,
  direction = DropdownMenuDirection.left,
  menuWidth,
}: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const hasText = typeof text !== 'undefined';

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
      if ((visible || animating) && !dropdownMenuRef.current.contains(e.target as Node)) {
        clickHandler(false);
      }
    };

    document?.body.addEventListener('click', handle);

    return () => {
      document?.body.removeEventListener('click', handle);
    };
  }, [visible, animating, clickHandler]);

  return (
    <StyledDropdownMenu ref={dropdownMenuRef} stretch={stretch}>
      <StyledDropdownMenuButton
        onClick={() => clickHandler()}
        visible={visible}
        aria-label={visible ? buttonAriaLabels.close : buttonAriaLabels.open}
        form={form}
        stretch={stretch}
        color={buttonColor}
        size={buttonSize}
      >
        {text && <StyledDropdownMenuButtonText>{text}</StyledDropdownMenuButtonText>}
        <StyledDropdownMenuButtonIcon hasText={hasText} size={buttonSize}>
          {visible
            ? React.createElement(feather.X)
            : React.createElement(feather[icon || 'Circle'])}
        </StyledDropdownMenuButtonIcon>
      </StyledDropdownMenuButton>
      <StyledDropdownMenuDropdown
        visible={visible}
        animating={animating}
        direction={direction}
        menuWidth={menuWidth}
      >
        <StyledDropdownMenuDropdownContent>
          {React.Children.toArray(children).map((child) => {
            const elementType = (child as React.ReactElement)?.props?.__TYPE;

            return React.cloneElement(child as React.ReactElement, {
              onClick:
                elementType === 'HeaderMenuLink' || elementType === 'Button'
                  ? () => {
                      clickHandler(false);

                      if (typeof (child as React.ReactElement)?.props?.onClick === 'function') {
                        (child as React.ReactElement)?.props?.onClick();
                      }
                    }
                  : (child as React.ReactElement)?.props?.onClick,
            });
          })}
        </StyledDropdownMenuDropdownContent>
      </StyledDropdownMenuDropdown>
    </StyledDropdownMenu>
  );
};
