import { css } from '@emotion/react';
import { useCallback, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { getPseudoUID, usePseudoUID } from '../../lib/uid';
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
  allDay: boolean;
  setAllDay: (allDay: boolean) => void;
  ticketUrl: string;
  setTicketUrl: (ticketUrl: string) => void;
  titleGerman: string;
  setTitleGerman: (title: string) => void;
  titleEnglish: string;
  setTitleEnglish: (title: string) => void;
  roomGerman: string;
  setRoomGerman: (room: string) => void;
  roomEnglish: string;
  setRoomEnglish: (room: string) => void;
  fromDateISOString: string;
  setFromDateISOString: (dateISOString: string) => void;
  fromTimeISOString: string;
  setFromTimeISOString: (timeISOString: string) => void;
  toDateISOString: string;
  setToDateISOString: (dateISOString: string) => void;
  toTimeISOString: string;
  setToTimeISOString: (timeISOString: string) => void;
  recurrence: string;
  setRecurrence: (recurrence: string) => void;
  earliestDate: Date;
  latestDate: Date;
  fromDateTime: Date;
  fromDate: Date;
  toDateValid: boolean;
  toTimeValid: boolean;
}

interface DateFormTimeProps {
  allDay: boolean;
  setAllDay: (allDay: boolean) => void;
  earliestDate: Date;
  latestDate: Date;
  fromDateISOString: string;
  setFromDateISOString: (dateISOString: string) => void;
  fromTimeISOString: string;
  setFromTimeISOString: (timeISOString: string) => void;
  toDateISOString: string;
  setToDateISOString: (dateISOString: string) => void;
  toTimeISOString: string;
  setToTimeISOString: (timeISOString: string) => void;
  fromDateTime: Date;
  fromDate: Date;
  toDateValid: boolean;
  toTimeValid: boolean;
}

export const DateFormTime: React.FC<DateFormTimeProps> = ({
  allDay,
  setAllDay,
  earliestDate,
  latestDate,
  fromDateISOString,
  setFromDateISOString,
  fromTimeISOString,
  setFromTimeISOString,
  toDateISOString,
  setToDateISOString,
  toTimeISOString,
  setToTimeISOString,
  fromDate,
  fromDateTime,
  toDateValid,
  toTimeValid,
}: DateFormTimeProps) => {
  const uid = usePseudoUID();

  const earliestDateISOString = formatISO(earliestDate, { representation: 'date' });
  const latestDateISOString = formatISO(latestDate, { representation: 'date' });

  return (
    <>
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
              if (e.target.value) {
                setFromDateISOString(e.target.value);
              }
            }}
            min={earliestDateISOString}
            max={latestDateISOString}
          />
          {!allDay && (
            <Input
              type={InputType.time}
              label="Uhrzeit"
              value={fromTimeISOString}
              onChange={(e) => {
                if (e.target.value) {
                  setFromTimeISOString(e.target.value);
                }
              }}
            />
          )}
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            type={InputType.date}
            label="bis"
            value={toDateISOString}
            onChange={(e) => setToDateISOString(e.target.value)}
            min={formatISO(max([earliestDate, fromDate]), { representation: 'date' })}
            max={latestDateISOString}
            valid={toDateValid}
            error={!toDateValid ? 'Das Enddatum muss später als das Startdatum sein.' : undefined}
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
              error={!toTimeValid ? 'Die Endzeit muss später als die Startzeit sein.' : undefined}
            />
          )}
        </FormItem>
      </FormGrid>
    </>
  );
};

const DateCreateForm: React.FC<DateCreateFormProps> = ({
  offerTitles,
  allDay,
  setAllDay,
  ticketUrl,
  setTicketUrl,
  titleGerman,
  setTitleGerman,
  titleEnglish,
  setTitleEnglish,
  roomGerman,
  setRoomGerman,
  roomEnglish,
  setRoomEnglish,
  fromDateISOString,
  setFromTimeISOString,
  fromTimeISOString,
  setFromDateISOString,
  toDateISOString,
  setToDateISOString,
  toTimeISOString,
  setToTimeISOString,
  recurrence,
  setRecurrence,
  earliestDate,
  latestDate,
  fromDateTime,
  fromDate,
  toDateValid,
  toTimeValid,
}: DateCreateFormProps) => {
  const uid = usePseudoUID();

  const earliestDateISOString = formatISO(earliestDate, { representation: 'date' });
  const latestDateISOString = formatISO(latestDate, { representation: 'date' });

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
          <DateFormTime
            {...{
              allDay,
              setAllDay,
              earliestDate,
              latestDate,
              fromDateISOString,
              setFromDateISOString,
              fromTimeISOString,
              setFromTimeISOString,
              toDateISOString,
              setToDateISOString,
              toTimeISOString,
              setToTimeISOString,
              fromDate,
              fromDateTime,
              toDateValid,
              toTimeValid,
            }}
          />
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

  const earliestDate = new Date();
  const latestDate = add(earliestDate, { years: 1 });
  const earliestDateISOString = formatISO(earliestDate, { representation: 'date' });
  const startTimeISOString = format(earliestDate, 'HH:mm');
  const startPlusOneHourTimeISOString = format(add(earliestDate, { hours: 1 }), 'HH:mm');

  const [allDay, setAllDay] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');
  const [titleGerman, setTitleGerman] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [roomGerman, setRoomGerman] = useState('');
  const [roomEnglish, setRoomEnglish] = useState('');
  const [recurrence, setRecurrence] = useState<string>();
  const [fromDateISOString, setFromDateISOString] = useState<string>(earliestDateISOString);
  const [fromTimeISOString, setFromTimeISOString] = useState<string>(startTimeISOString);
  const [toDateISOString, setToDateISOString] = useState<string>(earliestDateISOString);
  const [toTimeISOString, setToTimeISOString] = useState<string>(startPlusOneHourTimeISOString);

  const fromDateTime = useMemo(
    () => parseISO(`${fromDateISOString}T${!allDay ? fromTimeISOString : '00:00'}`),
    [allDay, fromDateISOString, fromTimeISOString]
  );

  const toDateTime = useMemo(
    () => parseISO(`${toDateISOString}T${!allDay ? toTimeISOString : '00:00'}`),
    [allDay, toDateISOString, toTimeISOString]
  );

  const fromDate = useMemo(() => new Date(fromDateISOString), [fromDateISOString]);
  const toDate = useMemo(() => new Date(toDateISOString), [toDateISOString]);

  const toDateValid = useMemo(() => compareAsc(fromDate, toDate) < 1, [fromDate, toDate]);

  const toTimeValid = useMemo(
    () => compareAsc(fromDateTime, toDateTime) === -1,
    [fromDateTime, toDateTime]
  );

  const date = useMemo<OfferDate>(
    () => ({
      data: {
        id: getPseudoUID(),
        attributes: {
          allDay,
          from: fromDateTime?.toISOString(),
          to: toDateTime?.toISOString(),
          status: OfferDateStatus.confirmed,
          ticketLink: ticketUrl,
          recurrence,
        },
        relations: {
          translations: [
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.de,
                name: titleGerman,
                room: roomGerman,
              },
            },
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.en,
                name: titleEnglish,
                room: roomEnglish,
              },
            },
          ],
        },
      },
    }),
    [
      allDay,
      fromDateTime,
      recurrence,
      roomEnglish,
      roomGerman,
      ticketUrl,
      titleEnglish,
      titleGerman,
      toDateTime,
    ]
  );

  const { renderedOverlay, setIsOpen } = useOverlay(
    <>
      <OverlayTitleBar
        title={t('dateCreate.overlayTitle', { offerTitle: offerTitles[language] }) as string}
        actions={[createButton]}
      />
      <DateCreateForm
        {...{
          offerTitles,
          ticketUrl,
          setTicketUrl,
          titleGerman,
          setTitleGerman,
          titleEnglish,
          setTitleEnglish,
          roomGerman,
          setRoomGerman,
          roomEnglish,
          setRoomEnglish,
          allDay,
          setAllDay,
          fromDateISOString,
          setFromDateISOString,
          fromTimeISOString,
          setFromTimeISOString,
          toDateISOString,
          setToDateISOString,
          toTimeISOString,
          setToTimeISOString,
          recurrence,
          setRecurrence,
          earliestDate,
          latestDate,
          fromDateTime,
          toDateTime,
          toDateValid,
          toTimeValid,
          fromDate,
        }}
      />
      <StyledDateCreateBottomBar>{createButton}</StyledDateCreateBottomBar>
    </>,
    false
  );

  const submitHandler = useCallback(() => {
    onSubmit(date);
    setIsOpen(false);
    setTicketUrl('');
    setTitleGerman('');
    setTitleEnglish('');
    setAllDay(false);
    setRoomGerman('');
    setRoomEnglish('');
    setFromDateISOString(earliestDateISOString);
    setFromTimeISOString(startTimeISOString);
    setToDateISOString(earliestDateISOString);
    setToTimeISOString(startPlusOneHourTimeISOString);
    setRecurrence(undefined);
  }, [
    date,
    onSubmit,
    setIsOpen,
    earliestDateISOString,
    startTimeISOString,
    startPlusOneHourTimeISOString,
  ]);

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
