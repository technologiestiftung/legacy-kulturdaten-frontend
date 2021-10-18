import styled from '@emotion/styled';
import React from 'react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Checkbox } from '../checkbox';

const StyledFormListConditional = styled.div<{ last?: boolean }>`
  display: flex;
  flex-direction: column;
  border-bottom: ${({ last }) => (last ? 'none' : '1px solid var(--grey-400)')};
`;

const StyledFormListConditionalLabel = styled.div`
  padding: 0.75rem 1.125rem;
`;

const StyledFormListConditionalChildren = styled.ul`
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--grey-400);
`;

const StyledFormListConditionalItem = styled.li``;

interface FormListConditionalProps {
  label: string;
  checked: boolean;
  onChange: (checked) => void;
  children: React.ReactNode;
  id?: string;
  last?: boolean;
}

export const FormListConditional: React.FC<FormListConditionalProps> = ({
  label,
  checked,
  onChange,
  children,
  id,
  last,
}: FormListConditionalProps) => {
  const t = useT();
  const uid = usePseudoUID();
  const childrenArray = React.Children.toArray(children);

  return (
    <StyledFormListConditional last={last}>
      <StyledFormListConditionalLabel>
        <Checkbox
          id={id || `${uid}-conditional`}
          label={label}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </StyledFormListConditionalLabel>
      {checked && childrenArray && (
        <StyledFormListConditionalChildren>
          {childrenArray.map((child, index) => (
            <StyledFormListConditionalItem key={index}>
              {React.cloneElement(child as React.ReactElement, {
                last: index === childrenArray.length - 1,
              })}
            </StyledFormListConditionalItem>
          ))}
        </StyledFormListConditionalChildren>
      )}
    </StyledFormListConditional>
  );
};
