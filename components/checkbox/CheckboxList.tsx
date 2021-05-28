import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { Checkbox, CheckboxProps } from '.';
import { useT } from '../../lib/i18n';
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
  font-size: 1rem;
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
  const t = useT();
  const [checkedState, setCheckedState] = useState<{
    [id: string]: { checked: boolean; value: string };
  }>(
    checkboxes.reduce((combined, { checked, value: checkboxValue }) => {
      const newCombined = {
        ...combined,
        [String(checkboxValue)]: {
          checked: checked || value?.includes(checkboxValue),
          value: checkboxValue,
        },
      };
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

  return (
    <StyledCheckboxList>
      <StyedCheckboxListLabel>
        <Label>
          {label} {required ? ` (${t('forms.required')})` : ''}
        </Label>
      </StyedCheckboxListLabel>
      <StyledCheckboxListItems>
        {checkboxes.map(({ id, label, value: checkboxValue }, index) => (
          <Checkbox
            id={id}
            label={label}
            key={index}
            checked={checkedState[checkboxValue]?.checked}
            onChange={(e) => {
              setCheckedState({
                ...checkedState,
                [String(checkboxValue)]: { checked: e.target.checked, value: checkboxValue },
              });

              const cleanSelectValue = selectValue.filter((entry) => entry !== checkboxValue);

              if (e.target.checked) {
                const newSelectValue = cleanSelectValue.concat([String(checkboxValue)]);

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

          const selectedOptions = Object.values(selectRef.current.selectedOptions)
            .filter(({ selected }) => selected === true)
            .map(({ value }) => value);

          setCheckedState({
            ...checkboxes.reduce((combined, { value: checkboxValue }) => {
              const newCombined = {
                ...combined,
                [String(checkboxValue)]: { checked: false, value: checkboxValue },
              };
              return newCombined;
            }, {}),
            ...Object.values(selectRef.current.selectedOptions).reduce(
              (combined, { selected, value: selectValue }) => {
                return { ...combined, [selectValue]: { checked: selected, value: selectValue } };
              },
              {}
            ),
          });

          if (onChange) {
            onChange(selectedOptions);
          } else {
            internalState[1](selectedOptions);
          }
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
