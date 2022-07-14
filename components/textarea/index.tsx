import styled from '@emotion/styled';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { useDebounce } from '../../lib/useDebounce';
import { inputStyles } from '../input';
import { Label, StyledLabel } from '../label';
import { Tooltip } from '../tooltip';
import { TooltipP } from '../tooltip/TooltipContent';

const StyledTextareaContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${StyledLabel} {
    padding-bottom: 0.75rem;
  }
`;

const StyledTextarea = styled.textarea<{ pristine?: boolean; valid?: boolean }>`
  display: block;
  ${(props) => inputStyles(props)}
  &::placeholder {
    opacity: 1;
  }
`;

const StyledTooltip = styled.div`
  margin-left: 0.5rem;
`;

export interface TextareaProps extends ComponentWithVariants {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: ChangeEventHandler<HTMLTextAreaElement>;
  label?: string;
  ariaLabel?: string;
  autoComplete?: string;
  autofocus?: boolean;
  name?: string;
  children?: React.ReactNode;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  tooltip?: string | React.ReactNode;
  required?: boolean;
  valid?: boolean;
  debounce?: boolean;
}

export const Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const [pristine, setPristine] = useState<boolean>(true);
  const t = useT();
  const [touched, setTouched] = useState(false);
  const [internalState, setInternalState] = useState(props?.value);
  const debouncer = useDebounce();

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

  return (
    <StyledTextareaContainer>
      {props.label && (
        <Label htmlFor={props.id}>
          {props.label}
          {props.required ? ` (${t('forms.required')})` : ''}
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
        </Label>
      )}
      <StyledTextarea
        {...props}
        value={props?.debounce ? internalState : props?.value || ''}
        valid={props.valid}
        pristine={pristine}
        onChange={(e) => {
          setTouched(true);

          if (props?.debounce) {
            setInternalState(e.target.value);
            debouncer(() => {
              props?.onChange(e);
            });
          } else {
            props?.onChange(e);
          }
        }}
        onBlur={(e) => {
          if (props?.onBlur) {
            props.onBlur(e);
          }

          setPristine(false);
        }}
        aria-label={props?.ariaLabel}
      />
    </StyledTextareaContainer>
  );
};
