import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React from 'react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Checkbox } from '../checkbox';
import { ChevronDown } from 'react-feather';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

const StyledFormListConditional = styled.div<{ last?: boolean; checked?: boolean }>`
  display: flex;
  flex-direction: column;
  border-bottom: ${({ last }) => (last ? 'none' : '1px solid var(--grey-400)')};
  background: ${({ checked }) => (checked ? 'var(--grey-200)' : 'var(--white)')};
`;

const StyledFormListConditionalLabel = styled.div`
  padding: 0.75rem;
  position: relative;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.125rem;
  }
`;

const StyledFormListConditionalChildren = styled.div`
  padding: 0 0.75rem 0.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.125rem 0.75rem 1.125rem;
  }
`;

const StyledFormListConditionalChildrenContainer = styled.ul`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--grey-400);
  border-radius: 0.375rem;
  background: var(--white);
  overflow: hidden;
`;

const StyledFormListConditionalItem = styled.li``;

const StyledFormListConditionalChevron = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  pointer-events: none;
  transition: transform var(--transition-duration);
  transform-origin: 50% 50%;
  line-height: 0;

  ${({ isOpen }) =>
    isOpen
      ? css`
          transform: rotateX(-180deg);
        `
      : css`
          transform: rotateX(0deg);
        `}

  ${mq(Breakpoint.mid)} {
    right: 1.125rem;
  }
`;

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
    <StyledFormListConditional last={last} checked={checked}>
      <StyledFormListConditionalLabel>
        <Checkbox
          id={id || `${uid}-conditional`}
          label={label}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <StyledFormListConditionalChevron isOpen={checked}>
          <ChevronDown color="var(--grey-600)" />
        </StyledFormListConditionalChevron>
      </StyledFormListConditionalLabel>
      {checked && childrenArray && (
        <StyledFormListConditionalChildren>
          <StyledFormListConditionalChildrenContainer>
            {childrenArray.map((child, index) => (
              <StyledFormListConditionalItem key={index}>
                {React.cloneElement(child as React.ReactElement, {
                  last: index === childrenArray.length - 1,
                })}
              </StyledFormListConditionalItem>
            ))}
          </StyledFormListConditionalChildrenContainer>
        </StyledFormListConditionalChildren>
      )}
    </StyledFormListConditional>
  );
};
