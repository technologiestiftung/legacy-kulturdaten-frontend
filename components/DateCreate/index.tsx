import { css } from '@emotion/react';
import { useCallback, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { OfferDate } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { usePseudoUID } from '../../lib/uid';
import { Button, ButtonColor, ButtonSize } from '../button';
import { Checkbox } from '../checkbox';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../EntryForm/wrappers';
import { Input, InputType } from '../input';
import { useOverlay } from '../overlay';
import { OverlayTitleBar } from '../overlay/OverlayTitleBar';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { add, compareAsc, format, formatISO, max } from 'date-fns';
import { parseISO } from 'date-fns';
import { useDateRecurrence } from '../DateRecurrence';
import { useLanguage } from '../../lib/routing';
import { Language } from '../../config/locale';
import { Info, InfoColor } from '../info';
import { mq } from '../globals/Constants';
import { Breakpoint } from '../../lib/WindowService';

interface DateCreateFormProps {
  offerTitles: { [key in Language]: string };
}

const DateCreateForm: React.FC<DateCreateFormProps> = ({ offerTitles }: DateCreateFormProps) => {
  const uid = usePseudoUID();
  const [allDay, setAllDay] = useState(false);

  const today = new Date();
  const latestDate = add(today, { years: 1 });

  const [ticketUrl, setTicketUrl] = useState('');
  const [titleGerman, setTitleGerman] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [roomGerman, setRoomGerman] = useState('');
  const [roomEnglish, setRoomEnglish] = useState('');

  const [recurrence, setRecurrence] = useState<string>();

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

  const { renderedDateRecurrence } = useDateRecurrence({
    startDate: fromDate,
    latestDate,
    recurrence,
    onChange: (changedRecurrence) => setRecurrence(changedRecurrence),
  });

  return (
    <>
      <EntryFormWrapper fullWidth reducedVerticalpadding>
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
                onChange={(e) => {
                  if (!recurrence) {
                    // initRecurrence();
                  }
                  setFromDateISOString(e.target.value);
                }}
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
          <EntryFormHead title="Termin wiederholen (optional)" />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>{renderedDateRecurrence}</FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Titel (optional)" />
          <FormGrid>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label="Titel deutsch"
                value={titleGerman}
                onChange={(e) => setTitleGerman(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label="Titel english"
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Info
                color={InfoColor.grey}
                title="Der Titel des Termins wird mit dem Titel des Angebots kombiniert."
                noMaxWidth
              >
                Deutsch: {offerTitles[Language.de]}
                {titleGerman ? ` - ${titleGerman}` : ''}
                <br />
                Englisch: {offerTitles[Language.en]}
                {titleEnglish ? ` - ${titleEnglish}` : ''}
              </Info>
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Rauminformation (optional)" />
          <FormGrid>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label="Rauminformation Deutsch"
                value={roomGerman}
                onChange={(e) => setRoomGerman(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label="Rauminformation Englisch"
                value={roomEnglish}
                onChange={(e) => setRoomEnglish(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer fullWidth>
          <EntryFormHead title="Weiterführende Links (optional)" />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <Input
                type={InputType.url}
                label="Ticketlink"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};

const StyledDateCreateBottomBar = styled.div`
  padding: 0.75rem;
  background: var(--grey-200);
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--grey-400);

  ${mq(Breakpoint.mid)} {
    padding: 0.75rem 1.5rem;
  }
`;

interface DateCreateProps {
  onSubmit: (date: OfferDate) => void;
  offerTitles: { [key in Language]: string };
}

export const DateCreate: React.FC<DateCreateProps> = ({
  onSubmit,
  offerTitles,
}: DateCreateProps) => {
  const t = useT();
  const language = useLanguage();

  const createButton = (
    <Button key={0} color={ButtonColor.black} onClick={() => submitHandler()}>
      {t('dateCreate.create')}
    </Button>
  );

  const { renderedOverlay, setIsOpen } = useOverlay(
    <>
      <OverlayTitleBar
        title={t('dateCreate.overlayTitle', { offerTitle: offerTitles[language] }) as string}
        actions={[createButton]}
      />
      <DateCreateForm offerTitles={offerTitles} />
      <StyledDateCreateBottomBar>{createButton}</StyledDateCreateBottomBar>
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
