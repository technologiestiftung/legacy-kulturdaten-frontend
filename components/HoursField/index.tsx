import styled from '@emotion/styled';

import { Hours, HoursWeekday } from '../../lib/api/types/hours';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor } from '../button';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Select } from '../select';

const StyledHoursField = styled.div`
  display: grid;
  grid-template-columns: 100%;
  row-gap: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 1.5rem;
  }
`;

const StyledHoursFieldAdd = styled.div`
  ${mq(Breakpoint.mid)} {
    grid-column: span 2;
  }
`;

const StyledHoursFieldItem = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  align-items: flex-end;
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    row-gap: 1.5rem;
    padding: 1.5rem;
  }
`;
const StyledHoursFieldItemWeekday = styled.div`
  align-self: stretch;
`;
const StyledHoursFieldItemTimes = styled.div`
  align-self: stretch;
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

  return (
    <StyledHoursField>
      {hours.map((hour, index) => (
        <StyledHoursFieldItem key={index}>
          <StyledHoursFieldItemWeekday>
            <Select
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
              label={t('hours.weekday') as string}
            >
              <option value={HoursWeekday.monday}>{t('days.monday.long')}</option>
              <option value={HoursWeekday.tuesday}>{t('days.tuesday.long')}</option>
              <option value={HoursWeekday.wednesday}>{t('days.wednesday.long')}</option>
              <option value={HoursWeekday.thursday}>{t('days.thursday.long')}</option>
              <option value={HoursWeekday.friday}>{t('days.friday.long')}</option>
              <option value={HoursWeekday.saturday}>{t('days.saturday.long')}</option>
              <option value={HoursWeekday.sunday}>{t('days.sunday.long')}</option>
            </Select>
          </StyledHoursFieldItemWeekday>
          <StyledHoursFieldItemTimes>
            <StyledHoursFieldItemTimesFrom>
              <Input
                type={InputType.time}
                value={hour.attributes.from}
                label={t('hours.from') as string}
                onChange={(e) =>
                  onChange([
                    ...hours.slice(0, index),
                    {
                      ...hour,
                      attributes: {
                        ...hour.attributes,
                        from: e.target.value,
                      },
                    },
                    ...hours.slice(index + 1),
                  ])
                }
              />
            </StyledHoursFieldItemTimesFrom>
            <StyledHoursFieldItemTimesTo>
              <Input
                type={InputType.time}
                value={hour.attributes.to}
                label={t('hours.to') as string}
                onChange={(e) =>
                  onChange([
                    ...hours.slice(0, index),
                    {
                      ...hour,
                      attributes: {
                        ...hour.attributes,
                        to: e.target.value,
                      },
                    },
                    ...hours.slice(index + 1),
                  ])
                }
              />
            </StyledHoursFieldItemTimesTo>
          </StyledHoursFieldItemTimes>
          <StyledHoursFieldItemRemove>
            <Button
              onClick={() => onChange(hours.filter((hour, hourIndex) => hourIndex !== index))}
            >
              {t('hours.remove')}
            </Button>
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
