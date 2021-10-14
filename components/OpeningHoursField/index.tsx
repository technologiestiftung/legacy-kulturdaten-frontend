import styled from '@emotion/styled';

import { OpeningHours, OpeningHoursWeekday } from '../../lib/api/types/openingHours';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Button, ButtonColor, ButtonSize } from '../button';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { Select, SelectSize } from '../select';

const StyledOpeningHoursField = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledOpeningHoursFieldAdd = styled.div`
  text-align: right;
  padding: 1.5rem 0;
`;

const StyledOpeningHoursFieldItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.75rem;
  row-gap: 0.75rem;
  align-items: flex-end;
  border-bottom: 1px solid var(--grey-600);
  padding: 0.375rem 0 0.75rem;

  ${mq(Breakpoint.mid)} {
    padding: 1.125rem 0 1.5rem;
    column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr auto;
    grid-column: span 1;
  }

  &:nth-of-type(1) {
    padding-top: 0;
  }
`;
const StyledOpeningHoursFieldItemWeekday = styled.div`
  grid-column: span 2;

  ${mq(Breakpoint.mid)} {
    grid-column: span 1;
  }
`;
const StyledOpeningHoursFieldItemTimes = styled.div`
  display: flex;
  column-gap: 0.75rem;
`;
const StyledOpeningHoursFieldItemTimesFrom = styled.div`
  flex-grow: 1;
`;
const StyledOpeningHoursFieldItemTimesTo = styled.div`
  flex-grow: 1;
`;
const StyledOpeningHoursFieldItemRemove = styled.div`
  text-align: right;
`;

interface OpeningHoursProps {
  openingHours: OpeningHours[];
  onChange: (openingHours: OpeningHours[]) => void;
}

export const OpeningHoursField: React.FC<OpeningHoursProps> = ({
  openingHours,
  onChange,
}: OpeningHoursProps) => {
  const uid = usePseudoUID();
  const t = useT();

  return (
    <StyledOpeningHoursField>
      {openingHours.map((openingHour, index) => (
        <StyledOpeningHoursFieldItem key={index}>
          <StyledOpeningHoursFieldItemWeekday>
            <Select
              id={`${uid}-openinghours`}
              value={openingHour.attributes.weekday}
              onChange={(e) => {
                onChange([
                  ...openingHours.slice(0, index),
                  {
                    ...openingHour,
                    attributes: {
                      ...openingHour.attributes,
                      weekday: e.target.value as OpeningHoursWeekday,
                    },
                  },
                  ...openingHours.slice(index + 1),
                ]);
              }}
              label={t('openingHours.weekday') as string}
              size={SelectSize.big}
            >
              <option value={OpeningHoursWeekday.monday}>{t('days.monday.long')}</option>
              <option value={OpeningHoursWeekday.tuesday}>{t('days.tuesday.long')}</option>
              <option value={OpeningHoursWeekday.wednesday}>{t('days.wednesday.long')}</option>
              <option value={OpeningHoursWeekday.thursday}>{t('days.thursday.long')}</option>
              <option value={OpeningHoursWeekday.friday}>{t('days.friday.long')}</option>
              <option value={OpeningHoursWeekday.saturday}>{t('days.saturday.long')}</option>
              <option value={OpeningHoursWeekday.sunday}>{t('days.sunday.long')}</option>
            </Select>
          </StyledOpeningHoursFieldItemWeekday>
          <StyledOpeningHoursFieldItemTimes>
            <StyledOpeningHoursFieldItemTimesFrom>
              <Input
                type={InputType.time}
                value={openingHour.attributes.from}
                label={t('openingHours.from') as string}
                onChange={(e) =>
                  onChange([
                    ...openingHours.slice(0, index),
                    {
                      ...openingHour,
                      attributes: {
                        ...openingHour.attributes,
                        from: e.target.value,
                      },
                    },
                    ...openingHours.slice(index + 1),
                  ])
                }
              />
            </StyledOpeningHoursFieldItemTimesFrom>
            <StyledOpeningHoursFieldItemTimesTo>
              <Input
                type={InputType.time}
                value={openingHour.attributes.to}
                label={t('openingHours.to') as string}
                onChange={(e) =>
                  onChange([
                    ...openingHours.slice(0, index),
                    {
                      ...openingHour,
                      attributes: {
                        ...openingHour.attributes,
                        to: e.target.value,
                      },
                    },
                    ...openingHours.slice(index + 1),
                  ])
                }
              />
            </StyledOpeningHoursFieldItemTimesTo>
          </StyledOpeningHoursFieldItemTimes>
          <StyledOpeningHoursFieldItemRemove>
            <Button
              size={ButtonSize.big}
              onClick={() =>
                onChange(
                  openingHours.filter((openingHour, openingHourIndex) => openingHourIndex !== index)
                )
              }
            >
              {t('openingHours.remove')}
            </Button>
          </StyledOpeningHoursFieldItemRemove>
        </StyledOpeningHoursFieldItem>
      ))}
      <StyledOpeningHoursFieldAdd>
        <Button
          size={ButtonSize.big}
          color={ButtonColor.black}
          onClick={() =>
            onChange([
              ...openingHours,
              { attributes: { weekday: OpeningHoursWeekday.monday, from: '09:00', to: '10:00' } },
            ])
          }
        >
          {t('openingHours.add')}
        </Button>
      </StyledOpeningHoursFieldAdd>
    </StyledOpeningHoursField>
  );
};
