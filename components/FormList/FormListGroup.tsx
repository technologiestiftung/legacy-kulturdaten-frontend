import styled from '@emotion/styled';
import React from 'react';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledFormListGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  max-width: 100%;
  min-width: 0;
`;

const StyledFormListGroupTitle = styled.h3`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  border-bottom: 1px solid var(--grey-400);
  background: var(--grey-200);
  padding: 0.75rem;
  border-radius: calc(0.75rem - 1px) calc(0.75rem - 1px) 0 0;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.125rem;
  }
`;

const StyledFormListGroupChildren = styled.ul`
  appearance: none;
  display: flex;
  flex-direction: column;
`;

const StyledFormListGroupItem = styled.li``;

const StyledSkipButton = styled.button`
position: absolute;
    opacity: 0;
    z-index: 10;

    &:focus {
      opacity: 1;
    }
  `;;

interface FormListGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const FormListGroup: React.FC<FormListGroupProps> = ({
  title,
  children,
}: FormListGroupProps) => {
  const childrenArray = React.Children.toArray(children);
  const uid = usePseudoUID()
  const t = useT();
  const SkipButtonHandler = (index) => {
    const nextField = document.getElementById(`radio-group-${uid}-${index + 1}`)
    if(nextField){
      nextField.focus()
    }
  }

  const isCheckBoxField = (index) => {
    const checkbox = children[index]?.props?.field?.type === 'checkboxList'
    const nextField = document.getElementById(`radio-group-${uid}-${index + 1}`)
    return checkbox && nextField
  }
  
  return (
    <StyledFormListGroup>
      {title && <StyledFormListGroupTitle>{title}</StyledFormListGroupTitle>}
      <StyledFormListGroupChildren>
        {childrenArray?.map((child, index) => (
          <StyledFormListGroupItem key={index}>
            <fieldset id={`radio-group-${uid}-${index}`} tabIndex={0}>
              {isCheckBoxField(index) && <StyledSkipButton onClick={() => SkipButtonHandler(index)}>{t('general.skipField') as string}</StyledSkipButton>}
              {React.cloneElement(child as React.ReactElement, {
                last: index === childrenArray.length - 1,
                first: !title && index === 0,
              })}
            </fieldset>
          </StyledFormListGroupItem>
        ))}
      </StyledFormListGroupChildren>
    </StyledFormListGroup>
  );
};
