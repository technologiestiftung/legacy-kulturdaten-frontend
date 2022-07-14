import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ComponentVariant, ComponentVariants, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { useDebounce } from '../../lib/useDebounce';
import { emailRegExpString, telRegExpString, urlRegExpString } from '../../lib/validations';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize } from '../button';
import { StyledError } from '../Error';
import { mq } from '../globals/Constants';
import { Label } from '../label';
import { Tooltip } from '../tooltip';
import { TooltipP } from '../tooltip/TooltipContent';

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledInputLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.375rem;
  position: relative;
`;

const StyledTooltip = styled.div`
  display: block;
  position: relative;
  margin-left: 0.5rem;
`;

const createdId = "input-id-" + Math.random().toString(16).slice(2);

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

  ${valid === false && errorStyle}

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
  id?: string;
}>`
  ${(props) => inputStyles(props)}
  &::placeholder {
    opacity: 1;
  }
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
  ariaLabel?: string;
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
  softRequired?: boolean;
  step?: number | string;
  valid?: boolean;
  value?: string | number;
  hideError?: boolean;
  debounce?: boolean | number;
  tooltip?: string;
}

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, forwardedRef: RefObject<HTMLInputElement>) => {
    const [pristine, setPristine] = useState<boolean>(true);
    const [normalized, setNormalized] = useState(true);
    const [touched, setTouched] = useState(false);
    const debouncer = useDebounce(typeof props?.debounce === 'number' ? props.debounce : undefined);
    const [internalState, setInternalState] = useState(props?.value);

    const t = useT();

    const internalRef = useRef<HTMLInputElement>(null);

    const ref = forwardedRef || internalRef;

    useEffect(() => {
      if (
        !touched &&
        internalState === '' &&
        ((typeof props?.value === 'string' && props?.value?.length > 0) ||
          typeof props?.value === 'number')
      ) {
        setInternalState(props.value);
      }
    }, [touched, props?.value, internalState]);

    const normalizeStrings = () => {
      switch (props?.type) {
        case InputType.url: {
          if (typeof props?.value === 'string' && (props?.value as string)?.length > 0) {
            if (!props?.value?.includes('://')) {
              if (props?.value?.includes(':/')) {
                const normalizedValue = props.value.replace(':/', '://');
                setInternalState(normalizedValue);
                props.onChange({
                  target: {
                    value: normalizedValue,
                  },
                } as ChangeEvent<HTMLInputElement>);
              } else if (typeof props?.onChange === 'function') {
                const normalizedValue = `http://${props.value}`;
                setInternalState(normalizedValue);
                props.onChange({
                  target: {
                    value: normalizedValue,
                  },
                } as ChangeEvent<HTMLInputElement>);
              }
            }
          }
          break;
        }

        case InputType.tel: {
          if (typeof props?.value === 'string' && (props?.value as string)?.length > 0) {
            const normalizedValue = props?.value?.replace(/\+/g, '00')?.match(/[0-9]/g).join('');
            setInternalState(normalizedValue);
            props.onChange({
              target: {
                value: normalizedValue,
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

    const inputValid = useMemo(() => {
      if (props?.softRequired) {
        if (props?.debounce) {
          return Boolean(String(internalState)?.length > 0);
        } else {
          return Boolean(String(props?.value)?.length > 0);
        }
      } else {
        return typeof props?.valid === 'undefined' ? true : props.valid;
      }
    }, [internalState, props?.debounce, props?.softRequired, props?.valid, props?.value]);
    return (
      <StyledInputContainer>
        {props.type === InputType.submit ? (
          <Button color={props.color} size={ButtonSize.default} asInput disabled={props.disabled}>
            {props.value}
          </Button>
        ) : (
          <>
            {props.label && (
              <StyledInputLabelContainer>
                <Label htmlFor={props.id ? props.id : createdId }>
                  {props.label}
                  {props.required || props.softRequired ? ` (${t('forms.required')})` : ''}
                </Label>
                {props.tooltip && (
                  <StyledTooltip>
                    <Tooltip>
                      {typeof props.tooltip === 'string' ? (
                        <TooltipP>{props.tooltip}</TooltipP>
                      ) : (
                        props.tooltip
                      )}
                    </Tooltip>
                  </StyledTooltip>
                )}
              </StyledInputLabelContainer>
            )}

            <StyledInput
              {...props}
              value={props?.debounce ? internalState : props?.value || ''}
              variant={props?.variant}
              aria-label={props?.ariaLabel}
              id={props.id ? props.id : createdId }
              autoComplete={props?.autoComplete}
              onChange={(e) => {
                if (
                  (props?.type !== InputType.date && props?.type !== InputType.time) ||
                  e.target.value
                ) {
                  if (props?.debounce) {
                    setTouched(true);
                    setInternalState(e.target.value);

                    debouncer(() => {
                      if (typeof props?.onChange === 'function') {
                        props?.onChange(e);
                        setNormalized(false);
                      }
                    });
                  } else {
                    if (typeof props?.onChange === 'function') {
                      props?.onChange(e);
                      setNormalized(false);
                    }
                  }
                }
              }}
              ref={ref}
              pristine={pristine}
              valid={inputValid}
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
