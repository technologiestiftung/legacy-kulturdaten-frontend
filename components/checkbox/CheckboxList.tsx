import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Checkbox, CheckboxProps } from '.';
import { Label } from '../label';

const StyledCheckboxList = styled.div``;

const StyedCheckboxListLabel = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledCheckboxListItems = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledHiddenMultiSelect = styled.select`
  opacity: 0;
  height: 0px;
  overflow: hidden;
  pointer-events: none;
`;

interface CheckboxListItemProps extends CheckboxProps {
  value: string;
}

interface CheckboxListProps {
  checkboxes: CheckboxListItemProps[];
  label: string;
  required?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  label,
  checkboxes,
  value,
  required,
  onChange,
}: CheckboxListProps) => {
  const [checkedState, setCheckedState] = useState<{
    [id: string]: { checked: boolean; value: string };
  }>(
    checkboxes.reduce((combined, { id, checked, value: checkboxValue }) => {
      const newCombined = { ...combined, [id]: { checked, value: checkboxValue } };
      return newCombined;
    }, {})
  );

  const internalState = useState<string[]>(
    Object.values(checkboxes)
      .filter(({ checked }) => checked === true)
      .map(({ value }) => value)
  );

  const selectValue = value || internalState[0];

  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    selectRef.current?.setAttribute('inert', '');
  }, [selectRef]);

  return (
    <StyledCheckboxList>
      <StyedCheckboxListLabel>
        <Label>{label}</Label>
      </StyedCheckboxListLabel>
      <StyledCheckboxListItems>
        {checkboxes.map(({ id, label, value: checkboxValue }, index) => (
          <Checkbox
            id={id}
            label={label}
            key={index}
            checked={checkedState[id]?.checked}
            onChange={(e) => {
              setCheckedState({
                ...checkedState,
                [id]: { checked: e.target.checked, value: checkboxValue },
              });

              const cleanSelectValue = selectValue.filter((entry) => entry !== checkboxValue);

              if (e.target.checked) {
                const newSelectValue = cleanSelectValue.concat([checkboxValue]);

                if (onChange) {
                  onChange(newSelectValue);
                } else {
                  internalState[1](newSelectValue);
                }
              } else {
                if (onChange) {
                  onChange(cleanSelectValue);
                } else {
                  internalState[1](cleanSelectValue);
                }
              }
            }}
            value={checkboxValue}
          />
        ))}
      </StyledCheckboxListItems>
      <StyledHiddenMultiSelect
        ref={selectRef}
        multiple
        required={required}
        value={selectValue}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {checkboxes.map(({ id, value, label }, index) => (
          <option id={id} value={value} key={index}>
            {label}
          </option>
        ))}
      </StyledHiddenMultiSelect>
    </StyledCheckboxList>
  );
};
