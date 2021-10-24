import styled from '@emotion/styled';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { useDebounce } from '../../lib/useDebounce';
import { inputStyles } from '../input';
import { Label, StyledLabel } from '../label';

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
  required?: boolean;
  valid?: boolean;
}

export const Textarea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const [pristine, setPristine] = useState<boolean>(true);
  const t = useT();
  const [touched, setTouched] = useState(false);
  const [internalState, setInternalState] = useState(props?.value);
  const debounce = useDebounce();

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
        </Label>
      )}
      <StyledTextarea
        {...props}
        value={internalState}
        valid={props.valid}
        pristine={pristine}
        onChange={(e) => {
          setTouched(true);

          setInternalState(e.target.value);

          debounce(() => {
            props?.onChange(e);
          });
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
