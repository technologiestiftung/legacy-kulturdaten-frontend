import styled from '@emotion/styled';
import { ChangeEventHandler, useState } from 'react';
import { useT } from '../../lib/i18n';
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

interface TextareaProps {
  id: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
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
        valid={props.valid}
        pristine={pristine}
        onBlur={() => setPristine(false)}
      />
    </StyledTextareaContainer>
  );
};
