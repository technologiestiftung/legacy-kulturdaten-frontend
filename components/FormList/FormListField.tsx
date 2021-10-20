import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ComponentVariant, ComponentVariants } from '../../lib/generalTypes';
import React from 'react';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { CheckboxList, CheckboxListProps } from '../checkbox/CheckboxList';
import { mq } from '../globals/Constants';
import { Input, InputProps } from '../input';
import { RadioList, RadioListProps } from '../Radio/RadioList';
import { Select, SelectProps, SelectVariant } from '../select';
import { Textarea, TextareaProps } from '../textarea';
import { AccessibilityFieldTooltip } from '../../lib/accessibility';
import { Tooltip } from '../tooltip';
import { TooltipP } from '../tooltip/TooltipContent';

const StyledFormListField = styled.div<{ last?: boolean }>`
  display: grid;
  grid-template-columns: 100%;
  border-bottom: ${({ last }) => (last ? 'none' : '1px solid var(--grey-400)')};

  ${({ last }) => last && 'border-radius: 0 0 calc(0.75rem - 1px) calc(0.75rem - 1px);'}

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 50% 50%;
  }
`;

const StyledFormListFieldLabel = styled.label`
  position: relative;
  display: inline-flex;
  column-gap: 0.75rem;
  justify-content: flex-start;
  border-bottom: 1px solid var(--grey-200);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.125rem;
    border-bottom: none;
    border-right: 1px solid var(--grey-400);
  }
`;

const StyledFormListFieldField = styled.div<{ last?: boolean; first?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  > * {
    flex-grow: 1;
  }

  ${({ last }) =>
    last &&
    css`
      overflow: hidden;
      border-bottom-left-radius: calc(0.75rem - 1px);
      border-bottom-right-radius: calc(0.75rem - 1px);
    `}

  ${mq(Breakpoint.mid)} {
    ${({ last }) =>
      last &&
      css`
        border-radius: 0;
        border-bottom-right-radius: calc(0.75rem - 1px);
      `}

    ${({ first }) =>
      first &&
      css`
        overflow: hidden;
        border-top-right-radius: calc(0.75rem - 1px);
      `}
  }
`;

export enum FormListFieldType {
  input = 'input',
  textarea = 'textarea',
  select = 'select',
  radioList = 'radioList',
  checkboxList = 'checkboxList',
}

const formListFieldTypeComponentMap: {
  [key in FormListFieldType]: {
    component: React.FC<
      InputProps | SelectProps | RadioListProps | CheckboxListProps | TextareaProps
    >;
    variant: ComponentVariant;
  };
} = {
  input: { component: Input, variant: ComponentVariants.formList },
  textarea: { component: Textarea, variant: ComponentVariants.formList },
  select: { component: Select, variant: SelectVariant.formList },
  radioList: { component: RadioList, variant: ComponentVariants.formList },
  checkboxList: { component: CheckboxList, variant: ComponentVariants.formList },
};

export interface FormListFieldProps {
  label: string;
  type: FormListFieldType;
  fieldProps: InputProps | SelectProps | RadioListProps | CheckboxListProps | TextareaProps;
  last?: boolean;
  first?: boolean;
  tooltip?: AccessibilityFieldTooltip;
}

export const FormListField: React.FC<FormListFieldProps> = ({
  label,
  type,
  fieldProps,
  last,
  first,
  tooltip,
}: FormListFieldProps) => {
  const uid = usePseudoUID();

  return (
    <StyledFormListField last={last}>
      <StyledFormListFieldLabel htmlFor={fieldProps?.id || `${uid}-field`}>
        <span>{label}</span>
        {tooltip && (
          <Tooltip>
            {tooltip.content?.map((item, index) => (
              <TooltipP key={index}>{item}</TooltipP>
            ))}
          </Tooltip>
        )}
      </StyledFormListFieldLabel>
      <StyledFormListFieldField last={last} first={first}>
        {type &&
          React.createElement(formListFieldTypeComponentMap[type].component, {
            id: `${uid}-field`,
            ...fieldProps,
            variant: formListFieldTypeComponentMap[type].variant,
          })}
      </StyledFormListFieldField>
    </StyledFormListField>
  );
};
