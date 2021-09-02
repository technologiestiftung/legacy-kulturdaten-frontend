import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useT } from '../../lib/i18n';

const StyledDayPicker = styled.div`
  display: flex;
  border: 1px solid var(--grey-600);
  border-radius: 0.375rem;
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 0.1875rem;
  padding: calc(0.375rem - 1px);
  min-width: min(100%, 22.5rem);
`;

const StyledDayPickerDayName = styled.div`
  position: relative;
  padding: calc(0.375rem - 1px) calc(0.5rem - 1px);
  text-align: center;
  cursor: pointer;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
`;

const StyledDayPickerDay = styled.div<{ checked: boolean }>`
  position: relative;
  border: 1px solid var(--black-o25);
  border-radius: 0.1875rem;
  background: ${({ checked }) => (checked ? 'var(--green-light)' : 'var(--grey-200)')};
  cursor: pointer;
  transition: background var(--transition-duration-fast);

  ${StyledDayPickerDayName} {
    ${({ checked }) =>
      checked
        ? css`
            text-decoration: underline;
          `
        : ''}
  }

  @media (pointer: fine) {
    &:hover {
      background: ${({ checked }) => (checked ? 'var(--green-light)' : 'var(--grey-400)')};
    }
  }
`;

const StyledDayPickerDayLabel = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
`;

const StyledDayPickerDayCheckbox = styled.input`
  appearance: none;
  background: none;
  border: none;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.1875rem;
  cursor: pointer;
`;

export enum DayPickerMode {
  week = 'week',
}

export const weekdays: {
  name: {
    long: string;
    short: string;
  };
}[] = [
  {
    name: {
      long: 'days.monday.long',
      short: 'days.monday.short',
    },
  },
  {
    name: {
      long: 'days.tuesday.long',
      short: 'days.tuesday.short',
    },
  },
  {
    name: {
      long: 'days.wednesday.long',
      short: 'days.wednesday.short',
    },
  },
  {
    name: {
      long: 'days.thursday.long',
      short: 'days.thursday.short',
    },
  },
  {
    name: {
      long: 'days.friday.long',
      short: 'days.friday.short',
    },
  },
  {
    name: {
      long: 'days.saturday.long',
      short: 'days.saturday.short',
    },
  },
  {
    name: {
      long: 'days.sunday.long',
      short: 'days.sunday.short',
    },
  },
];

interface DayPicker {
  value?: boolean[];
  onChange?: (value: boolean[]) => void;
  mode?: DayPickerMode;
}

export const DayPicker: React.FC<DayPicker> = ({ value, onChange }: DayPicker) => {
  const [internalState, setInternalState] = useState<boolean[]>(weekdays.map(() => false));
  const t = useT();

  const state = value || internalState;

  const changeHandler = (checked: boolean, index: number): void => {
    const updateState = onChange || setInternalState;

    const updatedState = [...state];
    updatedState[index] = checked;

    updateState(updatedState);
  };

  return (
    <StyledDayPicker aria-label={t('dayPicker.ariaLabel') as string} role="group">
      {weekdays.map(({ name: { short, long } }, index) => (
        <StyledDayPickerDay
          key={index}
          aria-label={t(long) as string}
          role="checkbox"
          checked={state[index]}
        >
          <StyledDayPickerDayLabel title={t(long) as string}>
            <StyledDayPickerDayCheckbox
              type="checkbox"
              checked={state[index]}
              onChange={(e) => changeHandler(e.target.checked, index)}
            />
            <StyledDayPickerDayName>{t(short)}</StyledDayPickerDayName>
          </StyledDayPickerDayLabel>
        </StyledDayPickerDay>
      ))}
    </StyledDayPicker>
  );
};
