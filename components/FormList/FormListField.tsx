import styled from '@emotion/styled';
import { ComponentVariant, ComponentVariants } from '../../lib/generalTypes';
import React from 'react';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { CheckboxList, CheckboxListProps } from '../checkbox/CheckboxList';
import { mq } from '../globals/Constants';
import { Input, InputProps } from '../input';
import { RadioList, RadioListProps } from '../Radio/RadioList';
import { Select, SelectProps, SelectVariant } from '../select';

const StyledFormListField = styled.div<{ last?: boolean }>`
  display: grid;
  grid-template-columns: 100%;
  border-bottom: ${({ last }) => (last ? 'none' : '1px solid var(--grey-400)')};

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 50% 50%;
  }
`;

const StyledFormListFieldLabel = styled.label`
  border-bottom: 1px solid var(--grey-200);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem 1.125rem;

  ${mq(Breakpoint.mid)} {
    border-bottom: none;
    border-right: 1px solid var(--grey-400);
  }
`;

const StyledFormListFieldField = styled.div``;

export enum FormListFieldType {
  input = 'input',
  select = 'select',
  radioList = 'radioList',
  checkboxList = 'checkboxList',
}

const formListFieldTypeComponentMap: {
  [key in FormListFieldType]: {
    component: React.FC<InputProps | SelectProps | RadioListProps | CheckboxListProps>;
    variant: ComponentVariant;
  };
} = {
  input: { component: Input, variant: ComponentVariants.formList },
  select: { component: Select, variant: SelectVariant.formList },
  radioList: { component: RadioList, variant: ComponentVariants.formList },
  checkboxList: { component: CheckboxList, variant: ComponentVariants.formList },
};

export interface FormListFieldProps {
  label: string;
  type: FormListFieldType;
  fieldProps: InputProps | SelectProps | RadioListProps | CheckboxListProps;
  last?: boolean;
}

export const FormListField: React.FC<FormListFieldProps> = ({
  label,
  type,
  fieldProps,
  last,
}: FormListFieldProps) => {
  const uid = usePseudoUID();

  return (
    <StyledFormListField last={last}>
      <StyledFormListFieldLabel htmlFor={fieldProps?.id || `${uid}-field`}>
        {label}
      </StyledFormListFieldLabel>
      <StyledFormListFieldField>
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
