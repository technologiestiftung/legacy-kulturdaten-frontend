import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Check } from 'react-feather';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledRadioVariant = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const borderWidth = '1px';

const StyledRadioVariantOptions = styled.div`
  display: flex;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  align-items: stretch;
  flex-direction: column;

  ${mq(Breakpoint.mid)} {
    flex-direction: row;
    column-gap: 1.5rem;
  }
`;

const StyledRadioVariantOption = styled.div<{ active: boolean }>`
  flex-basis: 0;
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: stretch;
`;

const StyledRadioVariantOptionMarker = styled.div`
  position: relative;
  cursor: pointer;
`;

const StyledRadioVariantOptionInput = styled.input`
  position: relative;
  appearance: none;
  margin: 0 0 0 0.75rem;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid var(--grey-400);
  border-radius: 1rem;
  pointer-events: none;
`;

const StyledRadioVariantOptionCheck = styled.div<{ active: boolean }>`
  position: absolute;
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  top: 0.25rem;
  right: 0.25rem;
  transition: opacity var(--transition-duration-fast);
  opacity: ${({ active }) => (active ? '1' : '0')};

  svg {
    width: 100%;
    height: 100%;
    stroke-width: 0.1875rem;
  }
`;

const StyledRadioVariantOptionLabel = styled.label<{ active: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  border: ${borderWidth} solid var(--grey-400);
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${({ active }) => (active ? 'var(--white)' : 'var(--grey-200)')};
  cursor: pointer;
  padding: 0.75rem;
  color: ${({ active }) => (active ? 'var(--black)' : 'var(--grey-600)')};

  transition: background var(--transition-duration-fast), color var(--transition-duration-fast),
    border-color var(--transition-duration-fast), box-shadow var(--transition-duration-fast);

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }

  &:hover {
    border-color: var(--grey-600);
    box-shadow: var(--shadow-sharp-hover);
    color: var(--black);
  }

  ${({ active }) =>
    active
      ? css`
          border-color: var(--grey-600);
          box-shadow: var(--shadow-sharp-active);

          &:hover {
            box-shadow: var(--shadow-sharp-active);
          }
        `
      : ''}
`;

const StyledRadioVariantOptionLabelContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-300) / 2);
  max-width: 52ch;
`;

const StyledRadioVariantOptionLabelHeadline = styled.div<{ active: boolean }>`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: var(--font-weight-bold);

  ${({ active }) =>
    active
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

const StyledRadioVariantOptionLabelChildren = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--line-height-300) / 2);
`;

export const RadioVariantOptionParagraph = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 400;
`;

export enum RadioVariantLabelPosition {
  left = 'left',
  top = 'top',
}

interface RadioVariantProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    label: string;
    id?: string;
    ariaLabel?: string;
    children?: React.ReactElement[];
  }[];
  labelledBy?: string;
}

export const RadioVariant: React.FC<RadioVariantProps> = ({
  name,
  value,
  onChange,
  options,
  labelledBy,
}: RadioVariantProps) => {
  const [internalState, setInternalState] = useState<string>();

  const state = value || internalState;

  return (
    <StyledRadioVariant role="radiogroup" aria-labelledby={labelledBy}>
      <StyledRadioVariantOptions>
        {options.map(({ value, label, id, ariaLabel, children }, index) => {
          const optionId = id || `${name}-${index}`;
          const optionActive = value === state;

          return (
            <StyledRadioVariantOption key={index} active={optionActive} role="radio">
              <StyledRadioVariantOptionLabel htmlFor={optionId} active={optionActive}>
                <StyledRadioVariantOptionLabelContent>
                  <StyledRadioVariantOptionLabelHeadline active={optionActive}>
                    {label}
                  </StyledRadioVariantOptionLabelHeadline>
                  {children && (
                    <StyledRadioVariantOptionLabelChildren>
                      {children}
                    </StyledRadioVariantOptionLabelChildren>
                  )}
                </StyledRadioVariantOptionLabelContent>
                <StyledRadioVariantOptionMarker>
                  <StyledRadioVariantOptionInput
                    type="radio"
                    id={optionId}
                    value={value}
                    name={name}
                    checked={optionActive}
                    onChange={() => (onChange ? onChange(value) : setInternalState(value))}
                    aria-label={ariaLabel}
                  />
                  <StyledRadioVariantOptionCheck active={optionActive}>
                    <Check />
                  </StyledRadioVariantOptionCheck>
                </StyledRadioVariantOptionMarker>
              </StyledRadioVariantOptionLabel>
            </StyledRadioVariantOption>
          );
        })}
      </StyledRadioVariantOptions>
    </StyledRadioVariant>
  );
};
