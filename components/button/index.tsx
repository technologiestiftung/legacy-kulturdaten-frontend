import React, { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import * as feather from 'react-feather';

export enum ButtonColor {
  default = 'default',
  green = 'green',
  yellow = 'yellow',
  red = 'red',
  blue = 'blue',
  white = 'white',
}

export enum ButtonSize {
  default = 'default',
  small = 'small',
  big = 'big',
}

export enum ButtonVariant {
  default = 'default',
  minimal = 'minimal',
}

const buttonColors: {
  [key in ButtonColor]: {
    background: string;
    color: string;
  };
} = {
  default: { background: 'var(--grey-350)', color: 'var(--black)' },
  green: { background: 'var(--green-light)', color: 'var(--black)' },
  yellow: { background: 'var(--yellow)', color: 'var(--black)' },
  red: { background: 'var(--red-50)', color: 'var(--black)' },
  blue: { background: 'var(--blue)', color: 'var(--white)' },
  white: { background: 'var(--white)', color: 'var(--black)' },
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
    iconGap: '0.5rem',
  },
};

const buttonVariants: { [key in ButtonVariant]: SerializedStyles } = {
  default: css`
    border: 1px solid var(--black);
    transition: box-shadow var(--transition-duration), transform var(--transition-duration);

    box-shadow: var(--shadow);

    &:hover {
      box-shadow: var(--shadow-hover), inset 0px 0px 0px 1px var(--black);
    }

    &:active {
      box-shadow: var(--shadow-active), inset 0px 0px 0px 1px var(--black);
      transform: translateY(0.125rem);
    }

    &:disabled {
      box-shadow: var(--shadow);
      transform: none;
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
};

const StyledButton = styled.button<{
  color: ButtonColor;
  size: ButtonSize;
  variant: ButtonVariant;
  disabled?: boolean;
}>`
  margin: 0;
  appearance: none;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid var(--black);
  background: ${({ color }) => buttonColors[color].background};
  color: ${({ color }) => buttonColors[color].color};
  font-size: ${({ size }) => buttonSizes[size].fontSize};
  line-height: ${({ size }) => buttonSizes[size].lineHeight};
  font-weight: 700;
  border-radius: ${({ size }) => buttonSizes[size].borderRadius};
  padding: ${({ size }) => buttonSizes[size].padding};
  cursor: pointer;

  ${({ variant }) => buttonVariants[variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;

const StyledButtonSpan = styled.span``;

export enum IconPosition {
  left = 'left',
  right = 'right',
}

const StyledButtonIcon = styled.div<{ size: ButtonSize; position: IconPosition }>`
  padding: ${({ size, position }) =>
    position === IconPosition.right
      ? `0 0 0 ${buttonSizes[size].iconGap}`
      : `0 ${buttonSizes[size].iconGap} 0 0`};
  display: flex;
  align-content: center;

  ${({ position }) => (position === IconPosition.left ? 'order: -1;' : '')}

  svg {
    display: block;
  }
`;

const buttonSizeIconSizeMap: { [key in ButtonSize]: number } = {
  default: 18,
  small: 16,
  big: 24,
};

export enum ButtonType {
  button = 'button',
  submit = 'submit',
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLInputElement>) => void;
  description?: string;
  disabled?: boolean;
  color?: ButtonColor;
  icon?: string;
  iconPosition?: IconPosition;
  id?: string;
  name?: string;
  asInput?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  description,
  disabled,
  color = ButtonColor.default,
  size = ButtonSize.default,
  variant = ButtonVariant.default,
  asInput,
  icon,
  iconPosition = IconPosition.right,
  id,
  name,
  type = ButtonType.button,
}: ButtonProps) =>
  asInput ? (
    <StyledButton
      as="input"
      value={children as string}
      color={color}
      size={size}
      variant={variant}
      id={id}
      name={name}
      type="submit"
      onClick={onClick ? (e: MouseEvent<HTMLInputElement>) => onClick(e) : undefined}
      disabled={disabled}
    />
  ) : (
    <StyledButton
      onClick={onClick ? (e: MouseEvent<HTMLButtonElement>) => onClick(e) : undefined}
      aria-label={description}
      color={color}
      size={size}
      variant={variant}
      id={id}
      name={name}
      disabled={disabled}
      type={type}
    >
      <StyledButtonSpan>{children}</StyledButtonSpan>
      {icon && feather[icon] ? (
        <StyledButtonIcon size={size} position={iconPosition}>
          {React.createElement(feather[icon], { size: buttonSizeIconSizeMap[size] })}
        </StyledButtonIcon>
      ) : (
        ''
      )}
    </StyledButton>
  );
