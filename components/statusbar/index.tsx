import styled from '@emotion/styled';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import React, { ChangeEvent, useState } from 'react';
import * as feather from 'react-feather';

export enum StatusBarState {
  draft = 'draft',
  published = 'published',
}

const statusBarStates: {
  [key in StatusBarState]: () => {
    backgroundColor: string;
  };
} = {
  draft: () => ({
    backgroundColor: 'var(--yellow)',
  }),
  published: () => ({
    backgroundColor: 'var(--green-light)',
  }),
};

const StatusBarLabel = styled.label`
  width: 100%;
  border-radius: 0.75rem 0.75rem 0 0;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 0.375rem 0.75rem 0.375rem 0.75rem;
  text-transform: none;
  border-width: 0;
  background-color: var(--grey-200);

  ${mq(Breakpoint.mid)} {
    width: auto;
    flex-direction: row;
    border: 1px solid var(--black);
    border-radius: 0.75rem 0 0 0.75rem;
  }
`;

const StyledStatusBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--black);
  border-radius: 0.75rem;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
    border-width: 0;
    border-radius: 0;
  }
`;

const StyledStatusBarInfo = styled.div`
  border: 1px solid var(--black);
  border-right-width: 0;
  border-left-width: 0;
  background-color: var(--grey-200);
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.375rem 0.75rem 0.375rem 0.75rem;
  position: relative;
  padding-right: 0.75rem;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    text-align: right;
  }
`;

const StyledSelect = styled.select<{
  statusBarState: StatusBarState;
}>`
  margin: 0;
  appearance: none;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.375rem 3rem 0.375rem 0.75rem;
  position: relative;
  width: 100%;
  cursor: pointer;
  font-weight: 700;
  border-width: 0;
  border-radius: 0 0 0.75rem 0.75rem;
  flex-grow: 0;
  flex-shrink: 0;

  ${mq(Breakpoint.mid)} {
    border: 1px solid var(--black);
    border-radius: 0 0.75rem 0.75rem 0;
  }

  ${({ statusBarState }) => statusBarStates[statusBarState]}
`;

const StyledSelectChevron = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0.5625rem;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  right: 0.625rem;
  left: initial;
  padding-left: 0.5625rem;
  border-left: 1px solid var(--black);

  svg {
    flex-shrink: 0;
    flex-grow: 0;
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const StyledSelectAndChevron = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
`;

interface StatusBarProps {
  children: React.ReactNode;
  id: string;
  value?: string;
  statusBarState?: StatusBarState;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  info?: string;
  defaultValue?: string;
  ariaLabel?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  children,
  id,
  value,
  onChange,
  label,
  info,
  defaultValue,
  ariaLabel,
}: StatusBarProps) => {
  const internalState = useState<string>(defaultValue);
  const valueState = value || internalState[0];

  return (
    <StyledStatusBarContainer>
      {label && <StatusBarLabel htmlFor={id}>{label}</StatusBarLabel>}
      <StyledStatusBarInfo>{info}</StyledStatusBarInfo>
      <StyledSelectAndChevron>
        <StyledSelect
          aria-label={ariaLabel}
          id={id}
          value={valueState}
          statusBarState={valueState as StatusBarState}
          onChange={
            onChange
              ? (e) => onChange(e)
              : (e: ChangeEvent<HTMLSelectElement>) => internalState[1](e.target.value)
          }
        >
          {children}
        </StyledSelect>
        <StyledSelectChevron>
          {React.createElement(feather.ChevronDown, { color: 'var(--black)' })}
        </StyledSelectChevron>
      </StyledSelectAndChevron>
    </StyledStatusBarContainer>
  );
};
