import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo } from 'react';

import { Hours, HoursWeekday, hoursWeekDayToNumber } from '../../lib/api/types/hours';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize, ButtonVariant } from '../button';
import { DayPicker } from '../DayPicker';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Select, SelectSize } from '../select';

const StyledHoursField = styled.div`
  display: flex;
  flex-direction: column;
  grid-template-columns: 100%;
  row-gap: 1.5rem;
`;

const StyledHoursFieldAdd = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: span 2;
  }
`;

const StyledHoursFieldItem = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 0.75rem;
  column-gap: 1.5rem;
  border-radius: 0.75rem;

  ${mq(Breakpoint.mid)} {
    align-items: flex-end;
    flex-direction: row;
  }
`;
const StyledHoursFieldItemWeekday = styled.div`
  display: flex;
`;
const StyledHoursFieldItemTimes = styled.div`
  display: flex;
  column-gap: 0.75rem;
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
`;

interface HoursProps {
  hours: Hours[];
  onChange: (hours: Hours[]) => void;
  i18nKeys?: {
    addButton: string;
  };
}

export const HoursField: React.FC<HoursProps> = ({ hours, onChange, i18nKeys }: HoursProps) => {
  const uid = usePseudoUID();
  const t = useT();

  const groupedHours: {
    from: string;
    to: string;
    hours: Hours[];
  }[] = useMemo(() => {
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
  }, [hours]);

  return (
    <StyledHoursField>
      {groupedHours.map((hour, index) => (
        <StyledHoursFieldItem key={index}>
          <StyledHoursFieldItemTimes>
            <StyledHoursFieldItemTimesFrom>
              <Input
                type={InputType.time}
                value={hour.from}
                ariaLabel={t('hours.from') as string}
                // onChange={(e) =>
                //   onChange([
                //     ...hours.slice(0, index),
                //     {
                //       ...hour,
                //       attributes: {
                //         ...hour.attributes,
                //         from: e.target.value,
                //       },
                //     },
                //     ...hours.slice(index + 1),
                //   ])
                // }
              />
            </StyledHoursFieldItemTimesFrom>
            <StyledHoursFieldItemTimesTo>
              <Input
                type={InputType.time}
                value={hour.to}
                ariaLabel={t('hours.to') as string}
                // onChange={(e) =>
                //   onChange([
                //     ...hours.slice(0, index),
                //     {
                //       ...hour,
                //       attributes: {
                //         ...hour.attributes,
                //         to: e.target.value,
                //       },
                //     },
                //     ...hours.slice(index + 1),
                //   ])
                // }
              />
            </StyledHoursFieldItemTimesTo>
          </StyledHoursFieldItemTimes>
          <StyledHoursFieldItemWeekday>
            {/* <Select
              id={`${uid}-hours`}
              value={hour.attributes.weekday}
              onChange={(e) => {
                onChange([
                  ...hours.slice(0, index),
                  {
                    ...hour,
                    attributes: {
                      ...hour.attributes,
                      weekday: e.target.value as HoursWeekday,
                    },
                  },
                  ...hours.slice(index + 1),
                ]);
              }}
              ariaLabel={t('hours.weekday') as string}
              size={SelectSize.big}
            >
              <option value={HoursWeekday.monday}>{t('days.monday.long')}</option>
              <option value={HoursWeekday.tuesday}>{t('days.tuesday.long')}</option>
              <option value={HoursWeekday.wednesday}>{t('days.wednesday.long')}</option>
              <option value={HoursWeekday.thursday}>{t('days.thursday.long')}</option>
              <option value={HoursWeekday.friday}>{t('days.friday.long')}</option>
              <option value={HoursWeekday.saturday}>{t('days.saturday.long')}</option>
              <option value={HoursWeekday.sunday}>{t('days.sunday.long')}</option>
            </Select> */}
            <DayPicker
              value={hour.hours.map((h) => hoursWeekDayToNumber(h.attributes.weekday) as Day)}
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
              onClick={() => onChange(hours.filter((hour, hourIndex) => hourIndex !== index))}
              icon="Trash2"
              size={ButtonSize.big}
            />
          </StyledHoursFieldItemRemove>
        </StyledHoursFieldItem>
      ))}
      <StyledHoursFieldAdd>
        <Button
          color={ButtonColor.black}
          onClick={() =>
            onChange([
              ...hours,
              { attributes: { weekday: HoursWeekday.monday, from: '09:00', to: '10:00' } },
            ])
          }
        >
          {t(i18nKeys?.addButton || 'hours.add')}
        </Button>
      </StyledHoursFieldAdd>
    </StyledHoursField>
  );
};
