import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import React, { ChangeEvent, useState } from 'react';
import * as feather from 'react-feather';
import { ComponentVariant, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { mq, focusStyles } from '../globals/Constants';

import { Label, StyledLabel } from '../label';

export enum SelectSize {
  default = 'default',
  big = 'big',
}

export enum SelectVariant {
  default = 'default',
  minimal = 'minimal',
  formList = 'formList',
  header = 'header',
}

const errorBorderShadow = 'inset 0px 0px 0px 1px var(--error)';
const errorBorderShadowHover = 'inset 0px 0px 0px 2px var(--error)';
const errorShadow = '0px 0px 0px 0.125rem var(--error-o50)';
const errorShadowInset = 'inset 0px 0px 0px 0.125rem var(--error-o50)';

const StyledSelectContainer = styled.div<{ labelPosition: SelectLabelPosition }>`
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ labelPosition }) =>
    labelPosition === SelectLabelPosition.left
      ? css`
          flex-direction: row;
          align-items: center;

          ${StyledLabel} {
            padding-right: 0.75rem;
          }
        `
      : css`
          flex-direction: column;

          ${StyledLabel} {
            padding-bottom: 0.375rem;
          }
        `}
`;

const selectSizes: {
  [key in SelectSize]: (withIcon: boolean) => {
    fontSize: string;
    lineHeight: string;
    padding: string;
  };
} = {
  default: (withIcon) => ({
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
    padding: `0.375rem 2.625rem 0.375rem ${withIcon ? '2.25' : '0.75'}rem`,
  }),
  big: (withIcon) => ({
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
    padding: `0.75rem 3rem 0.75rem ${withIcon ? '2.5' : '0.75'}rem`,
  }),
};

const selectVariants: {
  [key in SelectVariant]: (valid?: boolean) => SerializedStyles;
} = {
  default: (valid) => css`
    background: var(--white);
    transition: box-shadow var(--transition-duration);
    box-shadow: var(--shadow), inset 0px 0px 0px 1px var(--black);
    border: none;
    color: var(--black);

    &:hover {
      box-shadow: var(--shadow-hover), inset 0px 0px 0px 2px var(--black);
    }

    &:active {
      box-shadow: var(--shadow-active);
    }

    &:disabled {
      background: var(--grey-350);
      box-shadow: none;
      color: var(--black);
      cursor: not-allowed;
      border-color: var(--grey-350);
      opacity: 1;

      &:hover {
        box-shadow: none;
      }
    }

    ${valid === false &&
    css`
      box-shadow: ${errorShadow}, ${errorBorderShadow}, var(--shadow);

      &:hover {
        box-shadow: ${errorBorderShadowHover}, ${errorShadow}, var(--shadow-hover);
      }

      &:active {
        box-shadow: ${errorBorderShadowHover}, ${errorShadow}, var(--shadow-active);
      }
    `}
  `,
  minimal: (valid) => css`
    background: inherit;
    color: currentColor;
    border: none;
    box-shadow: inset 0px 0px 0px 1px var(--black);
    transition: box-shadow var(--transition-duration);

    &:hover {
      box-shadow: inset 0px 0px 0px 2px currentColor;
    }

    &:disabled {
      background: var(--grey-350);
      box-shadow: none;
      color: var(--black);
      cursor: not-allowed;
      border-color: var(--grey-350);
      opacity: 1;

      &:hover {
        box-shadow: none;
      }
    }

    ${valid === false &&
    css`
      box-shadow: ${errorShadow}, ${errorBorderShadow};

      &:hover {
        box-shadow: ${errorShadow}, ${errorBorderShadowHover};
      }
    `}
  `,
  header: (valid) => css`
    background: inherit;
    color: currentColor;
    border: none;
    box-shadow: inset 0px 0px 0px 1px var(--black);
    transition: box-shadow var(--transition-duration);

    &:hover {
      box-shadow: inset 0px 0px 0px 2px currentColor;
    }

    ${valid === false &&
    css`
      box-shadow: ${errorShadow}, ${errorBorderShadow};

      &:hover {
        box-shadow: ${errorShadow}, ${errorBorderShadowHover};
      }
    `}
  `,
  formList: (valid) => css`
    background: var(--white);
    transition: background var(--transition-duration), box-shadow var(--transition-duration);
    border: none;
    color: var(--black);
    border-radius: 0;

    padding: 0.75rem;

    ${mq(Breakpoint.mid)} {
      padding: 0.75rem 1.125rem;
    }

    &:hover {
      background: var(--grey-200);
    }

    &:active {
      box-shadow: inset 0px 0px 0px 1px var(--blue);
    }

    &:disabled {
      background: var(--grey-350);
      color: var(--black);
      cursor: not-allowed;
      border-color: var(--grey-350);
      opacity: 1;

      &:hover {
        background: var(--grey-350);
      }
    }

    ${valid === false &&
    css`
      box-shadow: ${errorShadowInset}, ${errorBorderShadow};

      &:active {
        box-shadow: ${errorShadowInset}, ${errorBorderShadowHover};
      }
    `}
  `,
};

const StyledSelect = styled.select<{
  selectSize: SelectSize;
  variant: SelectVariant | ComponentVariant;
  withIcon: boolean;
  valid?: boolean;
}>`
  margin: 0;
  appearance: none;
  border-radius: 0.375rem;
  font-size: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).fontSize};
  line-height: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).lineHeight};
  padding: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).padding};
  position: relative;
  width: 100%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${focusStyles}

  ${({ variant, valid }) => selectVariants[variant](valid)}
`;

const StyledSelectIcon = styled.div<{ size: SelectSize }>`
  pointer-events: none;
  position: absolute;
  left: 0.75rem;
  top: 0;
  height: ${({ size }) => (size === SelectSize.default ? '2.25rem' : '3rem')};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const StyledSelectChevron = styled(StyledSelectIcon)`
  right: 0.75rem;
  left: initial;
`;

const StyledSelectAndChevron = styled.div`
  position: relative;
  width: 100%;
`;

const selectSizeIconSizeMap: { [key in SelectSize]: number } = {
  default: 18,
  big: 24,
};

export enum SelectLabelPosition {
  left = 'left',
  top = 'top',
}

export interface SelectProps extends ComponentWithVariants {
  children: React.ReactNode;
  id: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  labelPosition?: SelectLabelPosition;
  defaultValue?: string;
  size?: SelectSize;
  variant?: SelectVariant | ComponentVariant;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  ariaLabelledby?: string;
  valid?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  children,
  id,
  value,
  onChange,
  label,
  labelPosition = SelectLabelPosition.top,
  defaultValue,
  icon,
  size = SelectSize.default,
  variant = SelectVariant.default,
  ariaLabel,
  disabled,
  placeholder,
  required,
  ariaLabelledby,
  valid,
}: SelectProps) => {
  const internalState = useState<string>(defaultValue);
  const t = useT();
  const valueState = value || internalState[0];
  const elementSize = variant === SelectVariant.formList ? SelectSize.big : size;

  return (
    <StyledSelectContainer labelPosition={labelPosition}>
      {label && (
        <Label htmlFor={id}>
          {label} {required ? ` ${t('forms.required')}` : ''}
        </Label>
      )}
      <StyledSelectAndChevron>
        <StyledSelect
          valid={valid}
          aria-label={ariaLabel}
          variant={variant}
          selectSize={elementSize}
          id={id}
          value={valueState || ''}
          onChange={
            onChange
              ? (e) => onChange(e)
              : (e: ChangeEvent<HTMLSelectElement>) => internalState[1](e.target.value)
          }
          withIcon={typeof icon !== 'undefined'}
          disabled={disabled}
          required={required}
          aria-labelledby={ariaLabelledby}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </StyledSelect>
        {icon && feather[icon] && (
          <StyledSelectIcon size={elementSize} aria-hidden >
            {React.createElement(feather[icon], { size: selectSizeIconSizeMap[elementSize] })}
          </StyledSelectIcon>
        )}
        <StyledSelectChevron size={elementSize} aria-hidden >
          {React.createElement(feather.ChevronDown, { size: selectSizeIconSizeMap[elementSize] })}
        </StyledSelectChevron>
      </StyledSelectAndChevron>
    </StyledSelectContainer>
  );
};
