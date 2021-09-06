import { css } from '@emotion/react';
import { useCallback, useState, useMemo } from 'react';
import { RRule, Frequency } from 'rrule';
import styled from '@emotion/styled';
import { OfferDate } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Checkbox } from '../checkbox';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import {
  EntryFormContainer,
  EntryFormContainerColumns,
  EntryFormWrapper,
} from '../EntryForm/wrappers';
import { Input, InputType } from '../input';
import { useOverlay } from '../overlay';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { Select, SelectSize } from '../select';
import { DayPicker } from '../DayPicker';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';
import { add, compareAsc, format, formatISO, max, min } from 'date-fns';
import { parseISO } from 'date-fns/esm';

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

const StyledDateRecurrenceItem = styled.div`
  width: 100%;
  display: flex;
  column-gap: 0.75rem;
`;

const frequencyNameMap = {
  [Frequency.DAILY]: 'Tage',
  [Frequency.WEEKLY]: 'Wochen',
  [Frequency.MONTHLY]: 'Monate',
};

interface DateRecurrenceProps {
  todayDateISOString: string;
  latestDateISOString: string;
}

const DateRecurrence: React.FC<DateRecurrenceProps> = ({
  todayDateISOString,
  latestDateISOString,
}: DateRecurrenceProps) => {
  const uid = usePseudoUID();
  const [frequency, setFrequency] = useState<Frequency>();

  return (
    <StyledDateRecurrence>
      <StyledDateRecurrenceLabel>Häufigkeit</StyledDateRecurrenceLabel>
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
          <option value="undefined">nie wiederholen</option>
          <option value={Frequency.DAILY}>täglich</option>
          <option value={Frequency.WEEKLY}>wöchentlich</option>
          <option value={Frequency.MONTHLY}>monatlich</option>
        </Select>
      </StyledDateRecurrenceItem>
      {frequency && (
        <>
          <StyledDateRecurrenceLabel>Wiederholen alle</StyledDateRecurrenceLabel>
          <StyledDateRecurrenceItem>
            <Input type={InputType.number} min={1} max={100} />
            <div>{frequencyNameMap[frequency]}</div>
          </StyledDateRecurrenceItem>
          {frequency === Frequency.WEEKLY && (
            <>
              <StyledDateRecurrenceLabel>An Wochentagen</StyledDateRecurrenceLabel>
              <StyledDateRecurrenceItem>
                <DayPicker />
              </StyledDateRecurrenceItem>
            </>
          )}
          <StyledDateRecurrenceLabel>Endet am</StyledDateRecurrenceLabel>
          <StyledDateRecurrenceItem>
            <Input type={InputType.date} min={todayDateISOString} max={latestDateISOString} />
          </StyledDateRecurrenceItem>
        </>
      )}
    </StyledDateRecurrence>
  );
};

const DateCreateForm: React.FC = () => {
  const uid = usePseudoUID();
  const [allDay, setAllDay] = useState(false);

  const today = new Date();
  const latestDate = add(today, { years: 1 });

  const [ticketUrl, setTicketUrl] = useState<string>();

  const todayDateISOString = formatISO(today, { representation: 'date' });
  const todayTimeISOString = format(today, 'HH:mm');
  const todayPlusOneHourTimeISOString = format(add(today, { hours: 1 }), 'HH:mm');
  const latestDateISOString = formatISO(latestDate, { representation: 'date' });

  const [fromDateISOString, setFromDateISOString] = useState<string>(todayDateISOString);
  const [fromTimeISOString, setFromTimeISOString] = useState<string>(todayTimeISOString);
  const [toDateISOString, setToDateISOString] = useState<string>(todayDateISOString);
  const [toTimeISOString, setToTimeISOString] = useState<string>(todayPlusOneHourTimeISOString);

  const fromDate = useMemo(() => new Date(fromDateISOString), [fromDateISOString]);
  const toDate = useMemo(() => new Date(toDateISOString), [toDateISOString]);

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
    <>
      <EntryFormWrapper fullWidth reducedVerticalpadding>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Informationen" />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <Input type={InputType.text} label="Titel (optional)" />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input type={InputType.text} label="Rauminformation (optional)" />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.url}
                label="Ticketlink (optional)"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Zeit" />
          <FormGrid>
            <FormItem width={FormItemWidth.full} alignSelf="flex-start" childrenFlexGrow="0">
              <Checkbox
                id={`checkbox-${uid}`}
                label="ist ganztägig"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.date}
                label="von"
                value={fromDateISOString}
                onChange={(e) => setFromDateISOString(e.target.value)}
                min={todayDateISOString}
                max={latestDateISOString}
              />
              {!allDay && (
                <Input
                  type={InputType.time}
                  label="Uhrzeit"
                  value={fromTimeISOString}
                  onChange={(e) => setFromTimeISOString(e.target.value)}
                />
              )}
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.date}
                label="bis"
                value={toDateISOString}
                onChange={(e) => setToDateISOString(e.target.value)}
                min={formatISO(max([today, fromDate]), { representation: 'date' })}
                max={latestDateISOString}
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
                  onChange={(e) => setToTimeISOString(e.target.value)}
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
        </EntryFormContainer>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Termin wiederholen" />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <DateRecurrence
                todayDateISOString={todayDateISOString}
                latestDateISOString={latestDateISOString}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};

interface DateCreateProps {
  onSubmit: (date: OfferDate) => void;
  offerTitle: string;
}

export const DateCreate: React.FC<DateCreateProps> = ({
  onSubmit,
  offerTitle,
}: DateCreateProps) => {
  const t = useT();

  const { renderedOverlay, isOpen, setIsOpen } = useOverlay(
    <>
      <OverlayTitleBar
        title={t('dateCreate.overlayTitle', { offerTitle }) as string}
        actions={[
          <Button key={0} color={ButtonColor.black} onClick={() => submitHandler()}>
            {t('dateCreate.create')}
          </Button>,
        ]}
      />
      <DateCreateForm />
    </>,
    true
  );

  const submitHandler = useCallback(() => {
    onSubmit(undefined);
    setIsOpen(false);
  }, [onSubmit, setIsOpen]);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        size={ButtonSize.big}
        icon="Plus"
        css={css`
          width: 100%;
        `}
        color={ButtonColor.white}
      >
        {t('dateCreate.create')}
      </Button>
      {renderedOverlay}
    </div>
  );
};
