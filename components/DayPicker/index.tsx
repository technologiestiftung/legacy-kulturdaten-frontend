import styled from '@emotion/styled';
import { useState } from 'react';
import { useT } from '../../lib/i18n';

const StyledDayPicker = styled.div`
  display: flex;
  border: 1px solid var(--grey-600);
  border-radius: 0.375rem;
`;

const StyledDayPickerDay = styled.div``;

const StyledDayPickerDayName = styled.div``;

const StyledDayPickerDayCheckbox = styled.input``;

const StyledDayPickerDayLabel = styled.label``;

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
        <StyledDayPickerDay key={index} aria-label={t(long) as string} role="checkbox">
          <StyledDayPickerDayLabel title={t(long) as string}>
            <StyledDayPickerDayName>{t(short)}</StyledDayPickerDayName>
            <StyledDayPickerDayCheckbox
              type="checkbox"
              checked={state[index]}
              onChange={(e) => changeHandler(e.target.checked, index)}
            />
          </StyledDayPickerDayLabel>
        </StyledDayPickerDay>
      ))}
    </StyledDayPicker>
  );
};
