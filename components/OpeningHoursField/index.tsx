import styled from '@emotion/styled';

import { OpeningHours, OpeningHoursWeekday } from '../../lib/api/types/openingHours';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Input, InputType } from '../input';
import { Select } from '../select';

const StyledOpeningHoursField = styled.div``;

const StyledOpeningHoursFieldAdd = styled.div``;
const StyledOpeningHoursFieldItem = styled.div``;
const StyledOpeningHoursFieldItemWeekday = styled.div``;
const StyledOpeningHoursFieldItemTimes = styled.div``;
const StyledOpeningHoursFieldItemTimesFrom = styled.div``;
const StyledOpeningHoursFieldItemTimesTo = styled.div``;
const StyledOpeningHoursFieldItemRemove = styled.div``;

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
              size={ButtonSize.small}
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
