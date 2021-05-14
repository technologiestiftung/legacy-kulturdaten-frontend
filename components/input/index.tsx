import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ChangeEventHandler, useState } from 'react';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Label, StyledLabel } from '../label';

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${StyledLabel} {
    padding-bottom: 0.75rem;
  }
`;

const borderShadow = 'inset 0px 0px 0px 1px var(--black)';
const errorBorderShadow = 'inset 0px 0px 0px 1px var(--error)';
const errorShadow = '0px 0px 0px 2px var(--error-o50)';

const errorStyle = css`
  box-shadow: ${errorBorderShadow}, ${errorShadow}, var(--shadow-inset);
`;

const StyledInput = styled.input<{ pristine: boolean; valid?: boolean }>`
  appearance: none;
  border: none;
  border-radius: 0.75rem;
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  background: var(--white);
  color: var(--black);
  box-shadow: ${borderShadow}, var(--shadow-inset);
  width: 100%;
  margin: 0;
  box-sizing: border-box;

  &::placeholder {
    color: var(--grey-600);
  }

  ${({ pristine, valid }) =>
    !pristine && valid === false
      ? errorStyle
      : !pristine
      ? css`
          &:invalid {
            ${errorStyle}
          }
        `
      : ''}
`;

const StyledError = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  color: var(--error);
  padding-top: 0.75rem;
`;

export enum InputType {
  date = 'date',
  email = 'email',
  number = 'number',
  password = 'password',
  submit = 'submit',
  tel = 'tel',
  text = 'text',
  time = 'time',
  url = 'url',
}

interface InputProps {
  type: InputType;
  autoComplete?: string;
  autofocus?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  error?: string;
  id?: string;
  hint?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  label?: string;
  min?: number | string;
  minLength?: number;
  max?: number | string;
  maxLength?: number;
  name?: string;
  placeholder?: string;
  pattern?: string;
  required?: boolean;
  step?: number | string;
  valid?: boolean;
  value?: string | number;
}

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const [pristine, setPristine] = useState<boolean>(true);
  const t = useT();

  return (
    <StyledInputContainer>
      {props.type === InputType.submit ? (
        <Button color={props.color} size={ButtonSize.default} asInput>
          {props.value}
        </Button>
      ) : (
        <>
          {props.label && (
            <Label htmlFor={props.id}>
              {props.label}
              {props.required ? ` (${t('forms.required')})` : ''}
            </Label>
          )}
          <StyledInput
            {...props}
            pristine={pristine}
            valid={props.valid}
            onBlur={() => setPristine(false)}
          />
        </>
      )}
      {!pristine && props.error && <StyledError>{props.error}</StyledError>}
    </StyledInputContainer>
  );
};
