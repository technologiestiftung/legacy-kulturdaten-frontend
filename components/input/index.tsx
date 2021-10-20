import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ChangeEvent, ChangeEventHandler, RefObject, useRef, useState } from 'react';
import { ComponentVariant, ComponentVariants, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { emailRegExpString, telRegExpString, urlRegExpString } from '../../lib/validations';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize } from '../button';
import { StyledError } from '../Error';
import { mq } from '../globals/Constants';
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

const hintBorderShadow = 'inset 0px 0px 0px 1px rgb(10, 47, 211)';
const hintShadow = '0px 0px 0px 0.125rem rgba(10, 47, 211, 0.4)';

const errorStyle = css`
  box-shadow: ${errorBorderShadow}, ${errorShadow}, var(--shadow-inset);
`;

const hintStyle = css`
  box-shadow: ${hintBorderShadow}, ${hintShadow}, var(--shadow-inset);
`;

export const inputStyles = ({
  pristine,
  valid,
  hint,
  hideError = false,
  variant = ComponentVariants.default,
}: {
  pristine?: boolean;
  valid?: boolean;
  hint?: boolean;
  hideError?: boolean;
  variant?: ComponentVariant;
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

  ${hint ? hintStyle : ''}

  ${!hideError &&
  !pristine &&
  css`
    &:invalid {
      ${errorStyle}
    }
  `}

  ${valid === false && !pristine && errorStyle}

  ${variant === ComponentVariants.formList &&
  css`
    border: none;
    box-shadow: var(--shadow-inset);
    border-radius: 0;
    padding: 0.75rem;
    flex-grow: 1;

    ${mq(Breakpoint.mid)} {
      padding: 0.75rem 1.125rem;
    }
  `}
`;

const StyledInput = styled.input<{
  pristine: boolean;
  valid?: boolean;
  hideError?: boolean;
  variant?: ComponentVariant;
}>`
  ${(props) => inputStyles(props)}
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

export interface InputProps extends ComponentWithVariants {
  type: InputType;
  autoComplete?: string;
  autofocus?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  error?: string;
  id?: string;
  hint?: boolean;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
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
  hideError?: boolean;
}

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, forwardedRef: RefObject<HTMLInputElement>) => {
    const [pristine, setPristine] = useState<boolean>(true);
    const [normalized, setNormalized] = useState(true);

    const t = useT();

    const internalRef = useRef<HTMLInputElement>(null);

    const ref = forwardedRef || internalRef;

    const normalizeStrings = () => {
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

      setNormalized(true);
    };

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
              variant={props?.variant}
              onChange={(e) => {
                if (props?.type !== InputType.date || e.target.value) {
                  if (typeof props?.onChange === 'function') {
                    props?.onChange(e);
                  }
                  setNormalized(false);
                }
              }}
              ref={ref}
              pristine={pristine}
              valid={typeof props.valid === 'undefined' ? true : props.valid}
              pattern={
                props?.type === InputType.url
                  ? urlRegExpString
                  : props?.type === InputType.email
                  ? emailRegExpString
                  : props?.type === InputType.tel
                  ? telRegExpString
                  : undefined
              }
              onBlur={(e) => {
                setPristine(false);
                normalizeStrings();

                if (props?.onBlur) {
                  props.onBlur(e);
                }
              }}
              onKeyDown={(e) => {
                if (
                  (e.key.toLowerCase() === 'enter' || e.key.toLowerCase() === 'return') &&
                  !normalized
                ) {
                  normalizeStrings();

                  return true;
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
