import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import * as feather from 'react-feather';
import { Label } from '../label';

const StyledRadioSwitch = styled.div``;

const StyledRadioSwitchLabel = styled.div``;

const borderWidth = '1px';

const StyledRadioSwitchOptions = styled.div`
  display: flex;
  border: ${borderWidth} solid var(--black);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--black);
  mask-image: -webkit-radial-gradient(white, black);
`;

const StyledRadioSwitchOption = styled.div<{ active: boolean }>`
  flex-basis: 0;
  flex-grow: 1;
  margin-right: 1px;
  position: relative;

  &:last-of-type {
    margin-right: 0;
  }
`;

const StyledRadioSwitchOptionInput = styled.input`
  position: absolute;
  appearance: none;
  background: transparent;
  padding: 3px;
  margin: 0;
  top: 3px;
  left: 3px;
  border: none;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-radius: 0.75rem;
  pointer-events: none;
`;

const StyledRadioSwitchOptionLabel = styled.label<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(0.375rem - ${borderWidth}) calc(0.75rem - ${borderWidth});
  background: var(--white);
  color: var(--grey-600);
  cursor: pointer;

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

const StyledRadioSwitchOptionLabelText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: var(--font-weight-bold);
  color: inherit;
`;

const StyledRadioSwitchOptionLabelIcon = styled.div`
  padding-right: 0.375rem;

  svg {
    color: inherit;
    width: 1.125rem;
    height: 1.125rem;
  }
`;

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
  label?: StringConstructor;
}

export const RadioSwitch: React.FC<RadioSwitchProps> = ({
  name,
  value,
  onChange,
  options,
  label,
}: RadioSwitchProps) => {
  const [internalState, setInternalState] = useState<string>();

  const state = value || internalState;

  return (
    <StyledRadioSwitch>
      {label && (
        <StyledRadioSwitchLabel>
          <Label>{label}</Label>
        </StyledRadioSwitchLabel>
      )}
      <StyledRadioSwitchOptions>
        {options.map(({ value, label, icon, id, ariaLabel }, index) => {
          const optionId = id || `${name}-${index}`;
          const optionActive = value === state;

          return (
            <StyledRadioSwitchOption key={index} active={optionActive}>
              <StyledRadioSwitchOptionInput
                type="radio"
                id={optionId}
                value={value}
                name={name}
                checked={optionActive}
                onChange={() => (onChange ? onChange(value) : setInternalState(value))}
                aria-label={ariaLabel}
              />
              <StyledRadioSwitchOptionLabel htmlFor={optionId} active={optionActive}>
                <StyledRadioSwitchOptionLabelIcon>
                  {icon && React.createElement(feather[icon])}
                </StyledRadioSwitchOptionLabelIcon>
                <StyledRadioSwitchOptionLabelText>{label}</StyledRadioSwitchOptionLabelText>
              </StyledRadioSwitchOptionLabel>
            </StyledRadioSwitchOption>
          );
        })}
      </StyledRadioSwitchOptions>
    </StyledRadioSwitch>
  );
};
