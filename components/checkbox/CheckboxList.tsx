import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox, CheckboxProps } from '.';
import { ComponentVariant, ComponentVariants, ComponentWithVariants } from '../../lib/generalTypes';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

const StyledCheckboxList = styled.div<{ variant?: ComponentVariant }>`
  display: flex;
  flex-direction: column;
  ${({ variant }) =>
    variant === ComponentVariants.formList &&
    css`
      padding: 0.75rem;

      ${mq(Breakpoint.mid)} {
        padding: 0.75rem 1.125rem;
      }
    `}
`;

const StyedCheckboxListLabel = styled.div`
  margin-bottom: 0.75rem;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const StyledCheckboxListItems = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
  grid-column-gap: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: ${({ columns }) => `repeat(${columns && columns > 2 ? 2 : 1}, 1fr)`};
  }

  ${mq(Breakpoint.wide)} {
    grid-template-columns: ${({ columns }) =>
      `repeat(${columns ? (columns > 3 ? 3 : columns) : 1}, 1fr)`};
  }
`;

const StyledHiddenMultiSelect = styled.select`
  opacity: 0;
  height: 0px;
  overflow: hidden;
  pointer-events: none;
  font-size: 1rem;
  padding: 0;
  border: none;
  margin: 0;
  appearance: none;
`;

const checkboxesToState = (
  checkboxes: CheckboxListItemProps[],
  value: string[]
): { [id: string]: { checked: boolean; value: string } } =>
  checkboxes.reduce((combined, { checked, value: checkboxValue }) => {
    const newCombined = {
      ...combined,
      [String(checkboxValue)]: {
        checked: checked || value?.includes(checkboxValue),
        value: checkboxValue,
      },
    };
    return newCombined;
  }, {});

interface CheckboxListItemProps extends CheckboxProps {
  value: string;
}

export interface CheckboxListProps extends ComponentWithVariants {
  checkboxes: CheckboxListItemProps[];
  id?: string;
  label?: string;
  required?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  columns?: number;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  label,
  id,
  checkboxes,
  value,
  required,
  onChange,
  columns,
  variant,
}: CheckboxListProps) => {
  const t = useT();
  const [checkedState, setCheckedState] = useState<{
    [id: string]: { checked: boolean; value: string };
  }>(checkboxesToState(checkboxes, value));

  useEffect(() => {
    setCheckedState(checkboxesToState(checkboxes, value));
  }, [checkboxes, value]);

  const internalState = useState<string[]>(
    Object.values(checkboxes)
      .filter(({ checked }) => checked === true)
      .map(({ value: checkboxValue }) => checkboxValue)
  );

  const selectValue = value || internalState[0];

  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <StyledCheckboxList variant={variant}>
      {label && (
        <StyedCheckboxListLabel>
          <legend>
            {label} {required ? ` ${t('forms.required')}` : ''}
          </legend>
        </StyedCheckboxListLabel>
      )}
      <StyledCheckboxListItems columns={columns} id={id}>
        {checkboxes.map(({ id, label, value: checkboxValue }, index) => (
          <Checkbox
            id={id}
            label={label}
            key={index}
            checked={
              checkedState[checkboxValue]?.checked || (value && value.includes(checkboxValue))
            }
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
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();

          const selectedOptions = Object.values(selectRef.current.selectedOptions)
            .filter(({ selected }) => selected === true)
            .map(({ value: optionValue }) => optionValue);

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
        {checkboxes.map(({ id, value: checkboxValue, label }, index) => (
          <option id={id} value={checkboxValue} key={index}>
            {label}
          </option>
        ))}
      </StyledHiddenMultiSelect>
    </StyledCheckboxList>
  );
};
