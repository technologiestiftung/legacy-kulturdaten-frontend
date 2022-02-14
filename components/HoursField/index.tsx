import styled from '@emotion/styled';
import { Dispatch, Reducer, useEffect, useReducer, useState } from 'react';

import { Hours } from '../../lib/api/types/hours';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor } from '../button';
import { mq } from '../globals/Constants';
import { HoursFieldItem } from './HoursFieldItem';

const StyledHoursField = styled.div`
  display: flex;
  flex-direction: column;
  grid-template-columns: 100%;
  row-gap: 0.75rem;
`;

const StyledHoursFieldAdd = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: span 2;
  }
`;

interface HoursFieldProps {
  hoursState: HoursGroup[];
  dispatch: Dispatch<HoursAction>;
  i18nKeys?: {
    addButton: string;
  };
}

const HoursField: React.FC<HoursFieldProps> = ({
  hoursState,
  dispatch,
  i18nKeys,
}: HoursFieldProps) => {
  const t = useT();

  return (
    <StyledHoursField>
      {hoursState.map((hoursGroup, index) => (
        <HoursFieldItem hoursGroup={hoursGroup} dispatch={dispatch} index={index} key={index} />
      ))}
      <StyledHoursFieldAdd>
        <Button
          color={ButtonColor.black}
          onClick={() =>
            dispatch({
              type: HoursActions.add,
              payload: {
                from: '09:00',
                to: '10:00',
                hours: [],
              },
            })
          }
        >
          {t(i18nKeys?.addButton || 'hours.add')}
        </Button>
      </StyledHoursFieldAdd>
    </StyledHoursField>
  );
};

export type HoursGroup = {
  from: string;
  to: string;
  hours: Hours[];
};

export enum HoursActions {
  add = 'add',
  init = 'init',
  remove = 'remove',
  update = 'update',
}

type HoursState = HoursGroup[];

export type HoursAction =
  | {
      type: HoursActions.add;
      payload: HoursGroup;
    }
  | {
      type: HoursActions.remove;
      payload: number;
    }
  | {
      type: HoursActions.update;
      payload: {
        index: number;
        group: HoursGroup;
      };
    }
  | {
      type: HoursActions.init;
      payload: HoursGroup[];
    };

const hoursReducer: Reducer<HoursState, HoursAction> = (state, action) => {
  switch (action.type) {
    case HoursActions.init: {
      return action.payload;
    }

    case HoursActions.add: {
      return [...state, action.payload];
    }

    case HoursActions.remove: {
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
    }

    case HoursActions.update: {
      return [
        ...state.slice(0, action.payload.index),
        action.payload.group,
        ...state.slice(action.payload.index + 1),
      ];
    }

    default: {
      break;
    }
  }
};

const hoursToHoursGroups = (hours: Hours[]) => {
  const groups: {
    from: string;
    to: string;
    hours: Hours[];
  }[] = [];

  if (hours?.length > 0) {
    const hoursCopy = [...hours];

    let n = 0;

    while (hoursCopy.length > 0) {
      const startHours = hoursCopy.pop();

      groups.push({
        from: startHours.attributes.from,
        to: startHours.attributes.to,
        hours: [startHours],
      });

      for (let i = hoursCopy.length - 1; i >= 0; i -= 1) {
        if (
          hoursCopy[i].attributes.from === startHours.attributes.from &&
          hoursCopy[i].attributes.to === startHours.attributes.to
        ) {
          groups[n].hours.push(hoursCopy.splice(i, 1)[0]);
        }
      }

      n += 1;
    }

    return groups.sort((a, b) => {
      if (a.from < b.from) {
        return -1;
      }

      if (a.from > b.from) {
        return 1;
      }

      return 0;
    });
  }

  return [];
};

const hoursGroupsToHours = (hoursGroups: HoursGroup[]): Hours[] => {
  const hours = hoursGroups.reduce<Hours[]>((combined, hoursGroup) => {
    const advanced = [...combined];

    hoursGroup.hours.forEach((candidate) => {
      if (
        advanced.findIndex(
          (existing) =>
            candidate.attributes.from === existing.attributes.from &&
            candidate.attributes.to === existing.attributes.to &&
            candidate.attributes.weekday === existing.attributes.weekday
        ) === -1
      ) {
        advanced.push(candidate);
      }
    });

    return advanced;
  }, []);

  return hours;
};

export const useHoursField = ({
  onChange,
  i18nKeys,
}: {
  onChange: (hours: Hours[]) => void;
  i18nKeys?: {
    addButton: string;
  };
}): {
  renderedHoursField: React.ReactElement;
  init: (hours: Hours[]) => void;
} => {
  const [hoursState, dispatch] = useReducer(hoursReducer, []);

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setUpdated(false);

      const next = hoursGroupsToHours(hoursState);
      console.log(next);
      onChange(next);
    }
  }, [hoursState, onChange, updated]);

  return {
    renderedHoursField: (
      <HoursField
        hoursState={hoursState}
        dispatch={(action) => {
          dispatch(action);
          setUpdated(true);
        }}
        i18nKeys={i18nKeys}
      />
    ),
    init: (hours) => {
      dispatch({
        type: HoursActions.init,
        payload: hoursToHoursGroups(hours),
      });
    },
  };
};
