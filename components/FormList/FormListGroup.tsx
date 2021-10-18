import styled from '@emotion/styled';
import React from 'react';

const StyledFormListGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  overflow: hidden;
`;

const StyledFormListGroupTitle = styled.h3`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  border-bottom: 1px solid var(--grey-400);
  background: var(--grey-200);
  padding: 0.75rem 1.125rem;
`;

const StyledFormListGroupChildren = styled.ul`
  appearance: none;
  display: flex;
  flex-direction: column;
`;

const StyledFormListGroupItem = styled.li``;

interface FormListGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const FormListGroup: React.FC<FormListGroupProps> = ({
  title,
  children,
}: FormListGroupProps) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <StyledFormListGroup>
      {title && <StyledFormListGroupTitle>{title}</StyledFormListGroupTitle>}
      <StyledFormListGroupChildren>
        {childrenArray?.map((child, index) => (
          <StyledFormListGroupItem key={index}>
            {React.cloneElement(child as React.ReactElement, {
              last: index === childrenArray.length - 1,
            })}
          </StyledFormListGroupItem>
        ))}
      </StyledFormListGroupChildren>
    </StyledFormListGroup>
  );
};
