import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { SerializedStyles } from '@emotion/utils';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';
import React, { ChangeEvent, useState } from 'react';
import * as feather from 'react-feather';

import { Label, StyledLabel } from '../label';

export enum StatusBarSize {
  default = 'default',
  big = 'big',
}

export enum StatusBarVariant {
  default = 'default',
  minimal = 'minimal',
}

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
    backgroundColor: 'var(--green-light)',
  }),
  published: () => ({
    backgroundColor: 'var(--yellow)',
  }),
};

const statusBarSizes: {
  [key in StatusBarSize]: () => {
    fontSize: string;
    lineHeight: string;
    padding: string;
  };
} = {
  default: () => ({
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
    padding: `0.375rem 3.375rem 0.375rem 0.75rem`,
  }),
  big: () => ({
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
    padding: `0.75rem 3.75rem 0.75rem 0.75rem`,
  }),
};

const statusBarVariants: { [key in StatusBarVariant]: SerializedStyles } = {
  default: css`
    background: var(--white);
    transition: box-shadow var(--transition-duration);
    box-shadow: var(--shadow);

    &:hover {
      box-shadow: var(--shadow-hover), inset 0px 0px 0px 1px var(--black);
    }

    &:active {
      box-shadow: var(--shadow-active);
    }
  `,
  minimal: css`
    background: inherit;
    color: currentColor;
    border-color: currentColor;
    transition: box-shadow var(--transition-duration);

    &:hover {
      box-shadow: inset 0px 0px 0px 1px currentColor;
    }
  `,
};

const StyledStatusBarContainer = styled.div<{
  statusBarSize: StatusBarSize;
  variant: StatusBarVariant;
}>`
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

  ${StyledLabel} {
    font-size: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().fontSize};
    line-height: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().lineHeight};
    padding: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().padding};
    padding-right: 0.75rem;
    text-transform: none;
    border-width: 0;
    
    ${mq(Breakpoint.mid)} {
      flex-direction: row;
      border: 1px solid var(--black);
      border-radius: 0.75rem 0 0 0.75rem;
    }
  }

  ${({ variant }) => statusBarVariants[variant]}
`;

const StyledStatusBarInfo = styled.div<{ 
  statusBarSize: StatusBarSize, 
  variant: StatusBarVariant 
}>`
  border: 1px solid var(--black);
  border-right-width: 0;
  border-left-width: 0;
  font-size: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().fontSize};
  line-height: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().lineHeight};
  padding: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().padding};
  position: relative;
  padding-right: 0.75rem;
  flex-grow: 1;

  ${mq(Breakpoint.mid)} {
    text-align: right;
  }

  ${({ variant }) => statusBarVariants[variant]}
`;

const StyledSelect = styled.select<{ 
  statusBarSize: StatusBarSize, 
  variant: StatusBarVariant,
  statusBarState: StatusBarState
}>`
  margin: 0;
  appearance: none;
  font-size: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().fontSize};
  line-height: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().lineHeight};
  padding: ${({ statusBarSize }) => statusBarSizes[statusBarSize]().padding};
  position: relative;
  width: 100%;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  border-width: 0;
  border-radius: 0 0 0.75rem 0.75rem;

  ${mq(Breakpoint.mid)} {
    border: 1px solid var(--black);
    border-radius: 0 0.75rem 0.75rem 0;
  }

  ${({ variant }) => statusBarVariants[variant]}
  ${({ statusBarState }) => statusBarStates[statusBarState]}
`;

const StyledSelectChevron = styled.div<{ size: StatusBarSize }>`
  pointer-events: none;
  position: absolute;
  left: 0.75rem;
  top: 0;
  height: ${({ size }) =>
    size === StatusBarSize.default ? 'calc(2.25rem + 2px)' : 'calc(3rem + 2px)'};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  right: 0.75rem;
  left: initial;
  padding-left: 0.75rem;
  border-left: 1px solid var(--black);
`;

const StyledSelectAndChevron = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const statusBarSizeIconSizeMap: { [key in StatusBarSize]: number } = {
  default: 18,
  big: 24,
};

const statusBarStateMap: { [key in StatusBarState]: string } = {
  draft: 'draft',
  published: 'published',
};

interface StatusBarProps {
  children: React.ReactNode;
  id: string;
  value?: string;
  state?: StatusBarState;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  info?: string;
  defaultValue?: string;
  size?: StatusBarSize;
  variant?: StatusBarVariant;
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
  size = StatusBarSize.default,
  variant = StatusBarVariant.default,
  ariaLabel,
}: StatusBarProps) => {
  const internalState = useState<string>(defaultValue);
  const valueState = value || internalState[0];

  return (
    <StyledStatusBarContainer
      variant={variant}
      statusBarSize={size}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledStatusBarInfo
        variant={variant}
        statusBarSize={size}
      >{info}
      </StyledStatusBarInfo>
      <StyledSelectAndChevron>
        <StyledSelect
          variant={variant}
          statusBarSize={size}
          aria-label={ariaLabel}
          id={id}
          value={valueState}
          statusBarState={statusBarStateMap[valueState]}
          onChange={
            onChange
              ? (e) => onChange(e)
              : (e: ChangeEvent<HTMLSelectElement>) => internalState[1](e.target.value)
          }
        >
          {children}
        </StyledSelect>
        <StyledSelectChevron size={size}>
          {React.createElement(feather.ChevronDown, { size: statusBarSizeIconSizeMap[size] })}
        </StyledSelectChevron>
      </StyledSelectAndChevron>
    </StyledStatusBarContainer>
  );
};
