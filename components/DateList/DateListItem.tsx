import styled from '@emotion/styled';
import { add, compareAsc, format, formatISO9075, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { OfferDate } from '../../lib/api/types/offer';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint } from '../../lib/WindowService';
import { Checkbox } from '../checkbox';
import { EntryFormHead, EntryFormHeadSize } from '../EntryForm/EntryFormHead';
import { mq } from '../globals/Constants';
import { Input, InputType } from '../input';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { DateListRow } from './DateListRow';

const StyledDateListItemBody = styled.div`
  display: grid;

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 0.75rem;
    row-gap: 2.25rem;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 2.25rem;
  }
`;

const StyledDateListItemContainer = styled.div<{ columns: number }>`
  grid-column: span ${({ columns }) => columns};
`;

interface DateListItemProps {
  date: OfferDate;
  lastRow: boolean;
  editable: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export const DateListItem: React.FC<DateListItemProps> = ({
  date,
  lastRow,
  checked,
  setChecked,
  editable,
}: DateListItemProps) => {
  const uid = usePseudoUID();
  const language = useLanguage();
  const translation = getTranslation(language, date?.data?.relations?.translations);
  const dateId = date?.data?.id;

  const attributes = date.data.attributes;

  const allDay = attributes.allDay;
  const fromDate = useMemo(() => new Date(attributes.from), [attributes.from]);
  const toDate = useMemo(() => new Date(attributes.to), [attributes.to]);
  const today = new Date();
  const earliestDate = today;
  const latestDate = add(today, { years: 1 });

  const fromDateISOString = useMemo(
    () => formatISO9075(fromDate, { representation: 'date' }),
    [fromDate]
  );
  const fromTimeISOString = useMemo(() => format(fromDate, 'HH:mm'), [fromDate]);
  const toDateISOString = useMemo(
    () => formatISO9075(toDate, { representation: 'date' }),
    [toDate]
  );
  const toTimeISOString = useMemo(() => format(toDate, 'HH:mm'), [toDate]);

  const fromDateTime = useMemo(
    () => parseISO(`${fromDateISOString}T${!allDay ? fromTimeISOString : '00:00'}`),
    [allDay, fromDateISOString, fromTimeISOString]
  );

  const toDateTime = useMemo(
    () => parseISO(`${toDateISOString}T${!allDay ? toTimeISOString : '00:00'}`),
    [allDay, toDateISOString, toTimeISOString]
  );

  const toDateValid = useMemo(() => compareAsc(fromDate, toDate) < 1, [fromDate, toDate]);

  const toTimeValid = useMemo(
    () => compareAsc(fromDateTime, toDateTime) === -1,
    [fromDateTime, toDateTime]
  );

  return (
    <DateListRow
      from={attributes.from}
      to={attributes.to}
      allDay={attributes.allDay}
      status={attributes.status}
      title={translation?.attributes?.name}
      lastRow={lastRow}
      checked={checked}
      onChange={(checked) => {
        if (editable) {
          setChecked(checked);
        }
      }}
      body={
        <StyledDateListItemBody>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead title="Zeit" size={EntryFormHeadSize.small} />
            <FormGrid>
              <FormItem width={FormItemWidth.full} alignSelf="flex-start" childrenFlexGrow="0">
                <Checkbox
                  id={`checkbox-${uid}`}
                  label="ist ganztägig"
                  checked={attributes.allDay}
                  onChange={(e) => undefined}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.date}
                  label="von"
                  value={formatISO9075(fromDate, { representation: 'date' })}
                  onChange={(e) => undefined}
                  min={formatISO9075(today, { representation: 'date' })}
                  max={formatISO9075(add(today, { years: 1 }), { representation: 'date' })}
                />
                {!attributes.allDay && (
                  <Input
                    type={InputType.time}
                    label="Uhrzeit"
                    value={format(fromDate, 'HH:mm')}
                    onChange={(e) => undefined}
                  />
                )}
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.date}
                  label="bis"
                  value={formatISO9075(toDate, { representation: 'date' })}
                  onChange={(e) => undefined}
                  min={formatISO9075(today, { representation: 'date' })}
                  max={formatISO9075(latestDate, { representation: 'date' })}
                  valid={toDateValid}
                  error={
                    !toDateValid ? 'Das Enddatum muss später als das Startdatum sein.' : undefined
                  }
                />
                {!allDay && (
                  <Input
                    type={InputType.time}
                    label="Uhrzeit"
                    value={toTimeISOString}
                    onChange={(e) => undefined}
                    min={
                      compareAsc(parseISO(fromDateISOString), parseISO(toDateISOString)) === 0
                        ? format(add(fromDateTime, { minutes: 1 }), 'HH:mm')
                        : undefined
                    }
                    valid={toTimeValid}
                    error={
                      !toTimeValid ? 'Die Endzeit muss später als die Startzeit sein.' : undefined
                    }
                  />
                )}
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
        </StyledDateListItemBody>
      }
      hideCheckboxes={!editable}
    />
  );
};
