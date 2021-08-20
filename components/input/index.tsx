import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ChangeEvent, ChangeEventHandler, Ref, useState } from 'react';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Label, StyledLabel } from '../label';

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${StyledLabel} {
    padding-bottom: 0.375rem;
  }
`;

const borderShadow = 'inset 0px 0px 0px 1px var(--grey-600)';
const errorBorderShadow = 'inset 0px 0px 0px 1px var(--error)';
const errorShadow = '0px 0px 0px 0.125rem var(--error-o50)';

const errorStyle = css`
  box-shadow: ${errorBorderShadow}, ${errorShadow}, var(--shadow-inset);
`;

export const inputStyles = ({
  pristine,
  valid,
}: {
  pristine?: boolean;
  valid?: boolean;
}): SerializedStyles => css`
  appearance: none;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.125rem;
  font-family: var(--font-family);
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

  &:disabled {
    border: none;
    box-shadow: none;
    background: var(--grey-350);
    cursor: not-allowed;
  }

  ${!pristine && valid === false
    ? errorStyle
    : !pristine
    ? css`
        &:invalid {
          ${errorStyle}
        }
      `
    : ''}
`;

const StyledInput = styled.input<{ pristine: boolean; valid?: boolean }>`
  ${(props) => inputStyles(props)}
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

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const [pristine, setPristine] = useState<boolean>(true);
    const t = useT();

    return (
      <StyledInputContainer>
        {props.type === InputType.submit ? (
          <Button color={props.color} size={ButtonSize.default} asInput disabled={props.disabled}>
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
              ref={ref}
              pristine={pristine}
              valid={props.valid}
              pattern={
                props?.type === InputType.url
                  ? '^(https?://)?([a-zA-Z0-9]([a-zA-ZäöüÄÖÜ0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}$'
                  : props?.type === InputType.email
                  ? '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}'
                  : undefined
              }
              onBlur={() => {
                setPristine(false);

                switch (props?.type) {
                  case InputType.url: {
                    if (typeof props?.value === 'string' && (props?.value as string)?.length > 0) {
                      if (!props?.value?.includes('://')) {
                        if (props?.value?.includes(':/')) {
                          props.onChange({
                            target: {
                              value: props.value.replace(':/', '://'),
                            },
                          } as ChangeEvent<HTMLInputElement>);
                        } else if (typeof props?.onChange === 'function') {
                          props.onChange({
                            target: {
                              value: `http://${props.value}`,
                            },
                          } as ChangeEvent<HTMLInputElement>);
                        }
                      }
                    }
                    break;
                  }

                  case InputType.tel: {
                    if (typeof props?.value === 'string' && (props?.value as string)?.length > 0) {
                      props.onChange({
                        target: {
                          value: props.value.replace(/\+/g, '00').match(/[0-9]/g).join(''),
                        },
                      } as ChangeEvent<HTMLInputElement>);
                    }
                    break;
                  }

                  default: {
                    break;
                  }
                }
              }}
            />
          </>
        )}
        {!pristine && props.error && <StyledError>{props.error}</StyledError>}
      </StyledInputContainer>
    );
  }
);
