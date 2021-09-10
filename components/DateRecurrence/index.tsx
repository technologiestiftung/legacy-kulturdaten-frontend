import { useState, useMemo, useEffect } from 'react';
import { RRule, Frequency } from 'rrule';
import styled from '@emotion/styled';
import { usePseudoUID } from '../../lib/uid';
import { Input, InputType } from '../input';
import { Select, SelectSize } from '../select';
import { Day, DayPicker } from '../DayPicker';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { add, formatISO, getISODay } from 'date-fns';
import { useT } from '../../lib/i18n';

const StyledDateRecurrence = styled.div`
  display: grid;
  grid-template-columns: auto;
  column-gap: 1.5rem;
  justify-items: stretch;

  ${mq(Breakpoint.mid)} {
    row-gap: 1.5rem;
    max-width: 35rem;
    grid-template-columns: auto 1fr;
  }
`;

const StyledDateRecurrenceLabel = styled.label`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  font-weight: 700;
  padding: 1.5rem 0 0.75rem;

  &:first-of-type {
    padding: 0 0 0.75rem;
  }

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 0;

    &:first-of-type {
      padding: 0.75rem 0;
    }
  }
`;

const StyledDateRecurrenceInterval = styled.div`
  width: calc(3ch + 4.5rem);
`;

const StyledDateRecurrenceText = styled.div`
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  padding: 0.75rem 0;
`;

const StyledDateRecurrenceItem = styled.div`
  width: 100%;
  display: flex;
  column-gap: 0.75rem;
`;

const frequencyNameMap = {
  [Frequency.DAILY]: 'date.recurrence.days',
  [Frequency.WEEKLY]: 'date.recurrence.weeks',
  [Frequency.MONTHLY]: 'date.recurrence.months',
};

const rruleWeekdays = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];

interface DateRecurrenceProps {
  recurrence: string;
  onChange: (recurrence: string) => void;
  startDate: Date;
  latestDate: Date;
  frequency?: Frequency;
  setFrequency?: (frequency: Frequency) => void;
  interval?: number;
  setInterval?: (interval: number) => void;
  weekdays?: Day[];
  setWeekdays?: (weekdays: Day[]) => void;
  rule?: RRule;
  setRule?: (rule: RRule) => void;
}

const DateRecurrence: React.FC<DateRecurrenceProps> = ({
  startDate,
  latestDate,
  setRule,
  frequency,
  setFrequency,
  interval,
  setInterval,
  weekdays,
  setWeekdays,
}: DateRecurrenceProps) => {
  const t = useT();
  const uid = usePseudoUID();
  const [endDateISOString, setEndDateISOString] = useState(
    startDate ? formatISO(add(startDate, { months: 1 }), { representation: 'date' }) : ''
  );

  const endDate = useMemo(
    () => new Date(endDateISOString ? endDateISOString : ''),
    [endDateISOString]
  );

  const chosenRruleWeekdays = useMemo(
    () => rruleWeekdays.filter((weekday, index) => weekdays[index]),
    [weekdays]
  );

  useEffect(() => {
    if (frequency) {
      setRule(
        new RRule({
          freq: frequency,
          interval: interval,
          byweekday: frequency === Frequency.WEEKLY ? chosenRruleWeekdays : undefined,
          dtstart: startDate,
          until: endDate,
        })
      );
    }
  }, [chosenRruleWeekdays, endDate, frequency, interval, setRule, startDate]);

  return (
    <StyledDateRecurrence>
      <StyledDateRecurrenceLabel>{t('date.recurrence.frequency')}</StyledDateRecurrenceLabel>
      <StyledDateRecurrenceItem>
        <Select
          id={`select-${uid}`}
          size={SelectSize.big}
          value={frequency ? frequency.toString() : undefined}
          onChange={(e) => {
            console.log(e.target.value);
            setFrequency(e.target.value !== 'undefined' ? parseInt(e.target.value, 10) : undefined);
          }}
        >
          <option value="undefined">{t('date.recurrence.never')}</option>
          <option value={Frequency.DAILY}>{t('date.recurrence.daily')}</option>
          <option value={Frequency.WEEKLY}>{t('date.recurrence.weekly')}</option>
          <option value={Frequency.MONTHLY}>{t('date.recurrence.monthly')}</option>
        </Select>
      </StyledDateRecurrenceItem>
      {frequency && (
        <>
          <StyledDateRecurrenceLabel>{t('date.recurrence.repeatEvery')}</StyledDateRecurrenceLabel>
          <StyledDateRecurrenceItem>
            <StyledDateRecurrenceInterval>
              <Input
                type={InputType.number}
                min={1}
                max={100}
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value, 10))}
              />
            </StyledDateRecurrenceInterval>
            <StyledDateRecurrenceText>{t(frequencyNameMap[frequency])}</StyledDateRecurrenceText>
          </StyledDateRecurrenceItem>
          {frequency === Frequency.WEEKLY && (
            <>
              <StyledDateRecurrenceLabel>
                {t('date.recurrence.onWeekdays')}
              </StyledDateRecurrenceLabel>
              <StyledDateRecurrenceItem>
                <DayPicker value={weekdays} onChange={(value) => setWeekdays(value)} min={1} />
              </StyledDateRecurrenceItem>
            </>
          )}
          <StyledDateRecurrenceLabel>{t('date.recurrence.ends')}</StyledDateRecurrenceLabel>
          <StyledDateRecurrenceItem>
            <Input
              type={InputType.date}
              min={formatISO(startDate, { representation: 'date' })}
              max={formatISO(latestDate, { representation: 'date' })}
              value={endDateISOString}
              onChange={(e) => setEndDateISOString(e.target.value)}
            />
          </StyledDateRecurrenceItem>
        </>
      )}
    </StyledDateRecurrence>
  );
};

const getRRuleDay = (date: Date) => getISODay(date) - 1;

export const useDateRecurrence = (
  props: DateRecurrenceProps
): {
  renderedDateRecurrence: React.ReactElement<DateRecurrenceProps>;
  initViaRecurrenceString: (recurrence: string) => void;
} => {
  const [rule, setRule] = useState<RRule>(
    props?.recurrence ? RRule.fromString(props.recurrence) : undefined
  );

  const [frequency, setFrequency] = useState<Frequency>(rule?.options?.freq);
  const [interval, setInterval] = useState(rule?.options?.interval || 1);
  const [weekdays, setWeekdays] = useState(
    rule?.options?.byweekday
      ? (rule?.options?.byweekday as Day[])
      : props?.startDate
      ? [getRRuleDay(props?.startDate) as Day]
      : []
  );

  useEffect(() => props?.onChange(rule?.toString()), [props, props?.onChange, rule]);

  useEffect(() => {
    if (frequency !== Frequency.WEEKLY) {
      setWeekdays([getRRuleDay(props?.startDate) as Day]);
    }
  }, [frequency, props?.startDate]);

  return {
    renderedDateRecurrence: (
      <DateRecurrence
        {...props}
        {...{
          rule,
          setRule,
          frequency,
          setFrequency,
          interval,
          setInterval,
          weekdays,
          setWeekdays,
        }}
      />
    ),
    initViaRecurrenceString: (recurrence) => {
      const newRule = RRule.fromString(recurrence);
      setRule(newRule);
      setFrequency(newRule.options.freq);
      setInterval(newRule?.options.interval);
      setWeekdays(rule.options.byweekday as Day[]);
    },
  };
};
