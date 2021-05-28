import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import React, { ChangeEvent, useState } from 'react';
import * as feather from 'react-feather';
import { useT } from '../../lib/i18n';

import { Label, StyledLabel } from '../label';

export enum SelectSize {
  default = 'default',
  big = 'big',
}

export enum SelectVariant {
  default = 'default',
  minimal = 'minimal',
}

const StyledSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  ${StyledLabel} {
    padding-bottom: 0.75rem;
  }
`;

const selectSizes: {
  [key in SelectSize]: (
    withIcon: boolean
  ) => {
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
  [key in SelectVariant]: SerializedStyles;
} = {
  default: css`
    background: var(--white);
    transition: box-shadow var(--transition-duration);
    box-shadow: var(--shadow), inset 0px 0px 0px 1px var(--black);
    border: none;

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
  `,
  minimal: css`
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
  `,
};

const StyledSelect = styled.select<{
  selectSize: SelectSize;
  variant: SelectVariant;
  withIcon: boolean;
}>`
  margin: 0;
  appearance: none;
  border-radius: 0.75rem;
  font-size: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).fontSize};
  line-height: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).lineHeight};
  padding: ${({ selectSize, withIcon }) => selectSizes[selectSize](withIcon).padding};
  position: relative;
  width: 100%;
  cursor: pointer;

  ${({ variant }) => selectVariants[variant]}
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

interface SelectProps {
  children: React.ReactNode;
  id: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  defaultValue?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  icon?: string;
  ariaLabel?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  children,
  id,
  value,
  onChange,
  label,
  defaultValue,
  icon,
  size = SelectSize.default,
  variant = SelectVariant.default,
  ariaLabel,
  disabled,
  placeholder,
  required,
}: SelectProps) => {
  const internalState = useState<string>(defaultValue);
  const t = useT();
  const valueState = value || internalState[0];

  return (
    <StyledSelectContainer>
      {label && (
        <Label htmlFor={id}>
          {label} {required ? ` (${t('forms.required')})` : ''}
        </Label>
      )}
      <StyledSelectAndChevron>
        <StyledSelect
          aria-label={ariaLabel}
          variant={variant}
          selectSize={size}
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
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </StyledSelect>
        {icon && feather[icon] && (
          <StyledSelectIcon size={size}>
            {React.createElement(feather[icon], { size: selectSizeIconSizeMap[size] })}
          </StyledSelectIcon>
        )}
        <StyledSelectChevron size={size}>
          {React.createElement(feather.ChevronDown, { size: selectSizeIconSizeMap[size] })}
        </StyledSelectChevron>
      </StyledSelectAndChevron>
    </StyledSelectContainer>
  );
};
