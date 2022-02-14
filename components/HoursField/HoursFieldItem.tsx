import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dispatch, useMemo } from 'react';
import { HoursAction, HoursActions, HoursGroup } from '.';

import { dayNumberToHoursWeekday, hoursWeekDayToNumber } from '../../lib/api/types/hours';
import { useT } from '../../lib/i18n';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonSize, ButtonVariant } from '../button';
import { DayPicker } from '../DayPicker';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';

const errorShadow = '0px 0px 0px 0.125rem var(--error-o50)';

const StyledHoursFieldItem = styled.div<{ valid: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 0.75rem;
  column-gap: 1.5rem;
  border-radius: 0.75rem;
  background: var(--grey-200);
  border: 1px solid var(--grey-400);
  padding: calc(0.375rem - 1px) calc(0.75rem - 1px) calc(0.75rem - 1px);

  ${mq(Breakpoint.mid)} {
    align-items: flex-end;
    flex-direction: row;
  }

  ${({ valid }) =>
    !valid &&
    css`
      border-color: var(--error);
      box-shadow: ${errorShadow};
    `}
`;

const StyledHoursFieldItemWeekday = styled.div`
  display: flex;
  order: 2;

  @media screen and (min-width: 25.5rem) {
    order: 1;
  }
`;

const StyledHoursFieldItemTimes = styled.div`
  display: flex;
  column-gap: 0.75rem;
  order: 0;
`;

const StyledHoursFieldItemTimesFrom = styled.div`
  flex-grow: 1;
`;

const StyledHoursFieldItemTimesTo = styled.div`
  flex-grow: 1;
`;

const StyledHoursFieldItemRemove = styled.div`
  text-align: right;
  flex-grow: 1;
  align-self: flex-end;

  @media screen and (min-width: 25.5rem) {
    order: 2;
  }
`;

const StyledHoursFieldItemError = styled.div`
  color: var(--error);
  font-weight: 600;
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
`;

interface HoursFieldItemProps {
  hoursGroup: HoursGroup;
  dispatch: Dispatch<HoursAction>;
  index: number;
}

export const HoursFieldItem: React.FC<HoursFieldItemProps> = ({
  hoursGroup,
  dispatch,
  index,
}: HoursFieldItemProps) => {
  const t = useT();

  const valid = useMemo(
    () => (hoursGroup?.from < hoursGroup.to ? true : false),
    [hoursGroup?.from, hoursGroup?.to]
  );

  return (
    <StyledHoursFieldItem valid={valid}>
      <StyledHoursFieldItemTimes>
        <StyledHoursFieldItemTimesFrom>
          <Input
            type={InputType.time}
            value={hoursGroup.from}
            ariaLabel={t('hours.from') as string}
            label={t('hours.from') as string}
            onChange={(e) =>
              dispatch({
                type: HoursActions.update,
                payload: {
                  index,
                  group: {
                    ...hoursGroup,
                    from: e.target.value,
                    hours: hoursGroup.hours.map((hour) => ({
                      ...hour,
                      attributes: {
                        ...hour.attributes,
                        from: e.target.value,
                      },
                    })),
                  },
                },
              })
            }
          />
        </StyledHoursFieldItemTimesFrom>
        <StyledHoursFieldItemTimesTo>
          <Input
            type={InputType.time}
            value={hoursGroup.to}
            ariaLabel={t('hours.to') as string}
            label={t('hours.to') as string}
            valid={valid}
            onChange={(e) =>
              dispatch({
                type: HoursActions.update,
                payload: {
                  index,
                  group: {
                    ...hoursGroup,
                    to: e.target.value,
                    hours: hoursGroup.hours.map((hour) => ({
                      ...hour,
                      attributes: {
                        ...hour.attributes,
                        to: e.target.value,
                      },
                    })),
                  },
                },
              })
            }
          />
        </StyledHoursFieldItemTimesTo>
      </StyledHoursFieldItemTimes>
      <StyledHoursFieldItemWeekday>
        <DayPicker
          value={hoursGroup.hours.map((h) => hoursWeekDayToNumber(h.attributes.weekday) as Day)}
          label={t('hours.weekdays') as string}
          onChange={(days) =>
            dispatch({
              type: HoursActions.update,
              payload: {
                index,
                group: {
                  ...hoursGroup,
                  hours: days.map((day) => ({
                    attributes: {
                      from: hoursGroup.from,
                      to: hoursGroup.to,
                      weekday: dayNumberToHoursWeekday(day),
                    },
                  })),
                },
              },
            })
          }
        />
      </StyledHoursFieldItemWeekday>
      <StyledHoursFieldItemRemove>
        <Button
          variant={ButtonVariant.minimal}
          ariaLabel={t('hours.remove') as string}
          tooltip={t('hours.remove') as string}
          css={css`
            padding: 0.875rem;
            border-radius: 0.375rem;
          `}
          onClick={() => dispatch({ type: HoursActions.remove, payload: index })}
          icon="Trash2"
          size={ButtonSize.big}
        />
      </StyledHoursFieldItemRemove>
      {!valid && <StyledHoursFieldItemError>{t('hours.error')}</StyledHoursFieldItemError>}
    </StyledHoursFieldItem>
  );
};
