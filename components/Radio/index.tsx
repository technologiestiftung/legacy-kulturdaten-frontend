import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ChangeEventHandler } from 'react';
import { Check } from 'react-feather';

const StyledRadioInput = styled.input`
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
  border-radius: var(--line-height-300);
  padding: 0;
  transition: border var(--transition-duration);
  cursor: inherit;

  &:disabled {
    border: none;
    box-shadow: none;
    background: var(--grey-350);
  }
`;

const StyledRadio = styled.div<{ disabled?: boolean }>`
  display: flex;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    ${StyledRadioInput} {
      border: 2px solid var(--black);

      &:disabled {
        border: none;
      }
    }
  }
`;

const StyledRadioInputContainer = styled.div`
  position: relative;
  width: var(--line-height-300);
  height: var(--line-height-300);
`;

const StyledRadioInputCheck = styled.div<{ checked?: boolean }>`
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

const StyledRadioLabel = styled.label<{ disabled?: boolean }>`
  display: block;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0 0 0 0.75rem;
  flex-grow: 1;
`;

interface RadioProps {
  id: string;
  label?: string;
  ariaLabel?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
}

export const Radio: React.FC<RadioProps> = ({
  id,
  label,
  ariaLabel,
  onChange,
  checked,
  name,
  disabled,
  required,
  value,
}: RadioProps) => {
  return (
    <StyledRadio>
      <StyledRadioInputContainer>
        <StyledRadioInput
          type="radio"
          id={id}
          aria-label={ariaLabel}
          onChange={onChange}
          checked={checked}
          name={name}
          disabled={disabled}
          required={required}
          value={value}
        />
        <StyledRadioInputCheck checked={checked}>
          <Check color="var(--black)" />
        </StyledRadioInputCheck>
      </StyledRadioInputContainer>
      {label && (
        <StyledRadioLabel htmlFor={id} disabled={disabled}>
          {label}
        </StyledRadioLabel>
      )}
    </StyledRadio>
  );
};
