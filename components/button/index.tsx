import React, { MouseEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import * as feather from 'react-feather';
import { insetBorderColored } from '../globals/Constants';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { MouseTooltip } from '../MouseTooltip';

export enum ButtonColor {
  default = 'default',
  green = 'green',
  yellow = 'yellow',
  red = 'red',
  blue = 'blue',
  white = 'white',
  black = 'black',
}

export enum ButtonSize {
  default = 'default',
  small = 'small',
  big = 'big',
}

export enum ButtonVariant {
  default = 'default',
  minimal = 'minimal',
  borderless = 'borderless',
  toolbar = 'toolbar',
}

const buttonColors: {
  [key in ButtonColor]: {
    background: string;
    color: string;
    iconBackground: string;
  };
} = {
  default: {
    background: 'var(--grey-350)',
    color: 'var(--black)',
    iconBackground: 'rgba(255,255,255,0.15)',
  },
  green: {
    background: 'var(--green-publish)',
    color: 'var(--white)',
    iconBackground: '#069C6F',
  },
  yellow: {
    background: 'var(--yellow)',
    color: 'var(--black)',
    iconBackground: 'rgba(0,0,0,0.15)',
  },
  red: {
    background: 'var(--red-50)',
    color: 'var(--black)',
    iconBackground: 'rgba(255,255,255,0.15)',
  },
  blue: {
    background: 'var(--blue)',
    color: 'var(--white)',
    iconBackground: 'rgba(255,255,255,0.15)',
  },
  white: {
    background: 'var(--white)',
    color: 'var(--black)',
    iconBackground: 'rgba(0,0,0,0.05)',
  },
  black: {
    background: 'var(--black)',
    color: 'var(--white)',
    iconBackground: 'rgba(255,255,255,0.15)',
  },
};

const buttonSizes: {
  [key in ButtonSize]: {
    fontSize: string;
    lineHeight: string;
    padding: string;
    borderRadius: string;
    iconGap: string;
  };
} = {
  default: {
    fontSize: 'var(--font-size-300)',
    lineHeight: 'var(--line-height-300)',
    padding: 'calc(0.375rem - 1px) calc(0.75rem - 1px)',
    borderRadius: '0.75rem',
    iconGap: '0.375rem',
  },
  small: {
    fontSize: 'var(--font-size-200)',
    lineHeight: 'var(--line-height-200)',
    padding: 'calc(0.1875rem - 1px) calc(0.75rem - 1px)',
    borderRadius: '0.75rem',
    iconGap: '0.25rem',
  },
  big: {
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
    padding: 'calc(0.75rem - 1px) calc(1rem - 1px)',
    borderRadius: '0.75rem',
    iconGap: '0.875rem',
  },
};

const buttonVariants: { [key in ButtonVariant]: SerializedStyles } = {
  default: css`
    border: 1px solid rgba(0, 0, 0, 0.25);
    transition: box-shadow var(--transition-duration), transform var(--transition-duration),
      border-color var(--transition-duration);

    box-shadow: var(--shadow);

    &:hover {
      box-shadow: var(--shadow-hover);
      border-color: rgba(0, 0, 0, 0.75);
    }

    &:active {
      box-shadow: var(--shadow-active);
      transform: translateY(0.125rem);
    }

    &:disabled {
      box-shadow: var(--shadow);
      transform: none;
      border-color: rgba(0, 0, 0, 0.25);
    }
  `,
  minimal: css`
    border: 1px solid currentColor;
    background: inherit;
    color: currentColor;
    transition: box-shadow var(--transition-duration), transform var(--transition-duration);

    &:hover {
      box-shadow: inset 0px 0px 0px 1px currentColor;
    }

    &:active {
      transform: translateY(0.0625rem);
    }

    &:disabled {
      box-shadow: none;
      transform: none;
    }
  `,
  borderless: css`
    padding: 0;
    border: none;
    background: none;
  `,
  toolbar: css`
    padding: 0.5625rem 0.75rem;
    box-shadow: ${insetBorderColored('var(--black)', true)};
    border-radius: 0.375rem;
    border: none;

    &:hover {
      background: var(--white);
      color: var(--black);
    }
  `,
};

const StyledButtonText = styled.div<{
  variant: ButtonVariant;
  size: ButtonSize;
  iconPosition: IconPosition;
  hasIcon: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${({ size }) => buttonSizes[size].padding};

  ${({ variant, hasIcon, iconPosition }) =>
    variant === ButtonVariant.borderless &&
    hasIcon &&
    css`
      ${iconPosition === IconPosition.right ? 'padding-right: 0;' : 'padding-left: 0;'}
    `}
`;

const StyledButtonIcon = styled.div<{
  size: ButtonSize;
  position: IconPosition;
  hasChildren: boolean;
  variant: ButtonVariant;
  iconWidth?: string;
  iconHeight?: string;
  color: ButtonColor;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ color, variant }) =>
    variant !== ButtonVariant.borderless && variant !== ButtonVariant.toolbar
      ? buttonColors[color].iconBackground
      : 'transparent'};
  padding: ${({ size, position, hasChildren, variant }) =>
    hasChildren
      ? variant === ButtonVariant.borderless
        ? position === IconPosition.right
          ? `0 0 0 calc(${buttonSizes[size].iconGap} / 2)`
          : `0 calc(${buttonSizes[size].iconGap} / 2) 0 0`
        : `0 ${buttonSizes[size].iconGap}`
      : '0'};

  ${({ iconWidth }) =>
    iconWidth
      ? css`
          width: ${iconWidth};

          svg {
            width: 100%;
          }
        `
      : ''}

  ${({ iconHeight }) =>
    iconHeight
      ? css`
          height: ${iconHeight};

          svg {
            height: 100%;
          }
        `
      : ''}



  ${({ position }) => (position === IconPosition.left ? 'order: -1;' : '')}

  svg {
    display: block;
  }
`;

const StyledButton = styled.button<{
  color: ButtonColor;
  size: ButtonSize;
  variant: ButtonVariant;
  disabled?: boolean;
  customCss?: SerializedStyles;
  contentPosition?: ButtonContentPosition;
}>`
  margin: 0;
  appearance: none;
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: ${({ contentPosition }) =>
    contentPosition ? contentPosition : ButtonContentPosition.default};
  border: 1px solid var(--black);
  background: ${({ color }) => buttonColors[color].background};
  color: ${({ color }) => buttonColors[color].color};
  font-size: ${({ size }) => buttonSizes[size].fontSize};
  line-height: ${({ size }) => buttonSizes[size].lineHeight};
  font-weight: 700;
  border-radius: ${({ size }) => buttonSizes[size].borderRadius};
  padding: 0;
  cursor: pointer;
  overflow: hidden;

  ${({ variant }) => buttonVariants[variant]}

  ${({ customCss }) => customCss}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;

export enum ButtonContentPosition {
  default = 'space-between',
  center = 'center',
}
export enum IconPosition {
  left = 'left',
  right = 'right',
}

const buttonSizeIconSizeMap: { [key in ButtonSize]: number } = {
  default: 18,
  small: 16,
  big: 18,
};

export enum ButtonType {
  button = 'button',
  submit = 'submit',
}

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLInputElement>) => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement | HTMLInputElement>) => void;
  disabled?: boolean;
  color?: ButtonColor;
  contentPosition?: ButtonContentPosition;
  icon?: string;
  iconBackground?: boolean;
  renderedIcon?: React.ReactElement;
  iconPosition?: IconPosition;
  iconWidth?: string;
  iconHeight?: string;
  id?: string;
  name?: string;
  asInput?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  ariaLabel?: string;
  title?: string;
  css?: SerializedStyles;
  tooltip?: string;
  __TYPE?: 'Button';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  onMouseDown,
  disabled,
  color = ButtonColor.default,
  contentPosition = ButtonContentPosition.default,
  size = ButtonSize.default,
  variant = ButtonVariant.default,
  asInput,
  icon,
  renderedIcon,
  iconPosition = IconPosition.right,
  iconWidth,
  iconHeight,
  id,
  name,
  type = ButtonType.button,
  ariaLabel,
  title,
  css,
  tooltip,
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);
  const hasIcon = Boolean(renderedIcon || (icon && feather[icon]));

  return (
    <>
      {tooltip && isMidOrWider && (
        <MouseTooltip hoverElement={buttonRef.current}>{tooltip}</MouseTooltip>
      )}
      {asInput ? (
        <StyledButton
          ref={buttonRef}
          as="input"
          value={children as string}
          color={color}
          contentPosition={contentPosition}
          size={size}
          variant={variant}
          id={id}
          name={name}
          type="submit"
          onClick={onClick ? (e: MouseEvent<HTMLInputElement>) => onClick(e) : undefined}
          onMouseDown={
            onMouseDown ? (e: MouseEvent<HTMLInputElement>) => onMouseDown(e) : undefined
          }
          disabled={disabled}
          aria-label={ariaLabel}
          title={title}
          customCss={css}
        />
      ) : (
        <StyledButton
          ref={buttonRef}
          onClick={onClick ? (e: MouseEvent<HTMLButtonElement>) => onClick(e) : undefined}
          onMouseDown={
            onMouseDown ? (e: MouseEvent<HTMLButtonElement>) => onMouseDown(e) : undefined
          }
          color={color}
          contentPosition={contentPosition}
          size={size}
          variant={variant}
          id={id}
          name={name}
          disabled={disabled}
          type={type}
          aria-label={ariaLabel}
          title={title}
          customCss={css}
        >
          {children && (
            <StyledButtonText
              variant={variant}
              size={size}
              iconPosition={iconPosition}
              hasIcon={hasIcon}
            >
              {children}
            </StyledButtonText>
          )}
          {hasIcon && (
            <StyledButtonIcon
              size={size}
              iconWidth={iconWidth}
              iconHeight={iconHeight}
              position={iconPosition}
              hasChildren={typeof children !== 'undefined'}
              variant={variant}
              color={color}
            >
              {renderedIcon
                ? renderedIcon
                : React.createElement(feather[icon], { size: buttonSizeIconSizeMap[size] })}
            </StyledButtonIcon>
          )}
        </StyledButton>
      )}
    </>
  );
};

Button.defaultProps = {
  __TYPE: 'Button',
};
