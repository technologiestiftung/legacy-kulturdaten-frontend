import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import * as feather from 'react-feather';
import { Label, StyledLabel } from '../label';
import { focusStyles } from '../globals/Constants';

const StyledRadioSwitch = styled.div<{ labelPosition: RadioSwitchLabelPosition }>`
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ labelPosition }) =>
    labelPosition === RadioSwitchLabelPosition.left
      ? css`
          flex-direction: row;
          align-items: center;

          ${StyledLabel} {
            padding-right: 0.75rem;
          }
        `
      : css`
          flex-direction: column;

          ${StyledLabel} {
            padding-bottom: 0.375rem;
          }
        `}
`;

const borderWidth = '1px';

const StyledRadioSwitchOptions = styled.div`
  display: flex;
  border: ${borderWidth} solid var(--black);
  border-radius: 0.375rem;
  overflow: hidden;
  background: var(--black);
  mask-image: -webkit-radial-gradient(white, black);
  flex-wrap: wrap;
  align-items: stretch;
`;

const StyledRadioSwitchOption = styled.div<{ active: boolean }>`
  flex-basis: 0;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
`;

const StyledRadioSwitchOptionInput = styled.input`
  appearance: none;
  margin: 0 0 0 0.375rem;
  position: relative;
  background: var(--white);
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--grey-600);
  border-radius: 1rem;
  pointer-events: none;
  flex-shrink: 0;
  ${focusStyles}

  &::after {
    content: '';
    position: absolute;
    height: calc(100% - 0.125rem);
    width: calc(100% - 0.125rem);
    top: 0.0625rem;
    left: 0.0625rem;
    box-sizing: content-box;
    background: var(--black);
    border-radius: 1rem;
    opacity: 0;
  }

  &:checked {
    border-color: var(--white);

    &::after {
      opacity: 1;
    }
  }
`;

const StyledRadioSwitchOptionLabel = styled.label<{ active: boolean }>`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(0.375rem - ${borderWidth}) calc(0.75rem - ${borderWidth});
  background: var(--white);
  color: var(--grey-600);
  cursor: pointer;
  column-gap: 0.375rem;

  ${({ active }) =>
    active
      ? css`
          background: var(--black);
          color: var(--white);
        `
      : css`
          &:hover {
            background: var(--grey-350);
            color: var(--black);
          }
        `}
`;

const StyledRadioSwitchOptionLabelText = styled.span`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: var(--font-weight-bold);
  color: inherit;
`;

const StyledRadioSwitchOptionLabelIcon = styled.span`
  padding-right: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: inherit;
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export enum RadioSwitchLabelPosition {
  left = 'left',
  top = 'top',
}

interface RadioSwitchProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: {
    value: string;
    label: string;
    icon?: string;
    id?: string;
    ariaLabel?: string;
  }[];
  label?: string;
  labelPosition?: RadioSwitchLabelPosition;
}

export const RadioSwitch: React.FC<RadioSwitchProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  labelPosition = RadioSwitchLabelPosition.top,
}: RadioSwitchProps) => {
  const [internalState, setInternalState] = useState<string>();

  const state = value || internalState;

  return (
    <StyledRadioSwitch labelPosition={labelPosition} role="radiogroup">
      {label && <Label>{label}</Label>}
      <StyledRadioSwitchOptions>
        {options.map(({ value, label, icon, id, ariaLabel }, index) => {
          const optionId = id || `${name}-${index}`;
          const optionActive = value === state;

          return (
            <StyledRadioSwitchOption key={index} active={optionActive} role="radio">
              <StyledRadioSwitchOptionLabel htmlFor={optionId} active={optionActive}>
                <StyledRadioSwitchOptionLabelIcon>
                  {icon && React.createElement(feather[icon])}
                </StyledRadioSwitchOptionLabelIcon>
                <StyledRadioSwitchOptionLabelText>{label}</StyledRadioSwitchOptionLabelText>
                <StyledRadioSwitchOptionInput
                  type="radio"
                  id={optionId}
                  value={value}
                  name={name}
                  checked={optionActive}
                  onChange={() => (onChange ? onChange(value) : setInternalState(value))}
                  aria-label={ariaLabel}
                />
              </StyledRadioSwitchOptionLabel>
            </StyledRadioSwitchOption>
          );
        })}
      </StyledRadioSwitchOptions>
    </StyledRadioSwitch>
  );
};
