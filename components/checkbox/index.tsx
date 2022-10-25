import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Check } from 'react-feather';
import { useT } from '../../lib/i18n';
import { focusStyles } from '../globals/Constants';

const errorShadow = '0px 0px 0px 0.125rem var(--error-o50)';

const StyledCheckboxInput = styled.input<{ valid?: boolean }>`
  display: block;
  margin: 0;
  appearance: none;
  flex-grow: 0;
  flex-shrink: 0;
  width: var(--line-height-300);
  height: var(--line-height-300);
  background: var(--white);
  box-shadow: 0.0625rem 0.0625rem 0.25rem var(--black-o25);
  border: 1px solid var(--black);
  border-radius: 0.375rem;
  padding: 0;
  transition: border var(--transition-duration);
  cursor: inherit;
  ${focusStyles}

  &:disabled {
    border: none;
    box-shadow: none;
    background: var(--grey-350);
  }

  ${({ valid }) =>
    valid === false &&
    css`
      border-color: var(--error) !important;
      box-shadow: 0.0625rem 0.0625rem 0.25rem var(--black-o25), ${errorShadow};
    `}
`;

const StyledCheckbox = styled.div<{ disabled?: boolean }>`
  display: flex;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    ${StyledCheckboxInput} {
      border: 2px solid var(--black);

      &:disabled {
        border: none;
      }
    }
  }
`;

const StyledCheckboxListItem = styled.li<{ disabled?: boolean }>`
  display: flex;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    ${StyledCheckboxInput} {
      border: 2px solid var(--black);

      &:disabled {
        border: none;
      }
    }
  }
`;

const StyledCheckboxInputContainer = styled.div`
  position: relative;
  width: var(--line-height-300);
  height: var(--line-height-300);
`;

const StyledCheckboxInputCheck = styled.div<{ checked?: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity var(--transition-duration-fast);
  pointer-events: none;

  ${({ checked }) =>
    checked
      ? css`
          opacity: 1;
        `
      : ''}

  svg {
    width: 1.125rem;
    height: 1.125rem;
    stroke-width: 0.1875rem;
  }
`;

const StyledCheckboxLabel = styled.label<{ disabled?: boolean }>`
  display: block;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0 0 0 0.75rem;
  flex-grow: 1;
  a {
    color: inherit;
  }
`;

export interface InsideCheckboxProps {
  id: string;
  label?: string | React.ReactNode;
  ariaLabel?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  valid?: boolean;
}

export const InsideCheckbox: React.FC<InsideCheckboxProps> = ({
  id,
  label,
  ariaLabel,
  onChange,
  checked,
  name,
  disabled,
  required,
  value,
  valid,
}: InsideCheckboxProps) => {
  const internalState = useState<boolean>(false);
  const checkedState = checked || internalState[0];
  const t = useT();

  return (
    <>
      <StyledCheckboxInputContainer>
        <StyledCheckboxInput
          aria-label={ariaLabel}
          type="checkbox"
          id={id}
          name={name || id}
          required={required}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
              onChange(e);
            } else {
              internalState[1](e.target.checked);
            }
          }}
          checked={checkedState}
          disabled={disabled}
          value={value}
          valid={valid}
        />
        <StyledCheckboxInputCheck checked={checkedState}>
          <Check color="var(--black)" aria-hidden="true" />
        </StyledCheckboxInputCheck>
      </StyledCheckboxInputContainer>
      {label && (
        <StyledCheckboxLabel htmlFor={id} disabled={disabled}>
          {label}
          {required && ` ${t('forms.required')}`}
        </StyledCheckboxLabel>
      )}
    </>
  );
};

export interface CheckboxProps {
  id: string;
  label?: string | React.ReactNode;
  ariaLabel?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  valid?: boolean;
  inList?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  ariaLabel,
  onChange,
  checked,
  name,
  disabled,
  required,
  value,
  valid,
  inList,
}: CheckboxProps) => {

  return (
    <>
      {inList
        ?
        (<StyledCheckboxListItem disabled={disabled}>
          <InsideCheckbox
            id={id}
            label={label}
            ariaLabel={ariaLabel}
            onChange={onChange}
            checked={checked}
            name={name}
            disabled={disabled}
            required={required}
            value={value}
            valid={valid}
          />
        </StyledCheckboxListItem>)
        :
        (<StyledCheckbox disabled={disabled}>
          <InsideCheckbox
            id={id}
            label={label}
            ariaLabel={ariaLabel}
            onChange={onChange}
            checked={checked}
            name={name}
            disabled={disabled}
            required={required}
            value={value}
            valid={valid}
          />
        </StyledCheckbox>)
      }
    </>
  );
};
