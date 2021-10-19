import { css } from '@emotion/react';
import { useCallback, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize } from '../button';
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

interface DateFormTimeProps {
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
  const t = useT();

  const earliestDateISOString = formatISO(earliestDate, { representation: 'date' });
  const latestDateISOString = formatISO(latestDate, { representation: 'date' });

  return (
    <>
      <EntryFormHead title={t('date.time') as string} />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Input
            type={InputType.date}
            label={t('date.from') as string}
            value={fromDateISOString}
            onChange={(e) => setFromDateISOString(e.target.value)}
            min={earliestDateISOString}
            max={latestDateISOString}
          />
          {
            <Input
              type={InputType.time}
              label={t('date.clock') as string}
              value={fromTimeISOString}
              onChange={(e) => {
                if (e.target.value) {
                  setFromTimeISOString(e.target.value);
                }
              }}
            />
          }
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            type={InputType.date}
            label={t('date.to') as string}
            value={toDateISOString}
            onChange={(e) => setToDateISOString(e.target.value)}
            min={formatISO(max([earliestDate, fromDate]), { representation: 'date' })}
            max={latestDateISOString}
            valid={toDateValid}
            error={!toDateValid ? (t('date.toDateInvalid') as string) : undefined}
          />
          {
            <Input
              type={InputType.time}
              label={t('date.clock') as string}
              value={toTimeISOString}
              onChange={(e) => setToTimeISOString(e.target.value)}
              min={
                compareAsc(parseISO(fromDateISOString), parseISO(toDateISOString)) === 0
                  ? format(add(fromDateTime, { minutes: 1 }), 'HH:mm')
                  : undefined
              }
              valid={toTimeValid}
              error={!toTimeValid ? (t('date.toTimeInvalid') as string) : undefined}
            />
          }
        </FormItem>
      </FormGrid>
    </>
  );
};

const StyledDateCreateFormWrapper = styled.div`
  padding: 0 0.75rem;

  ${mq(Breakpoint.wide)} {
    padding: 0 1.5rem;
  }
`;

interface DateCreateFormProps {
  offerTitles: { [key in Language]: string };
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

const DateCreateForm: React.FC<DateCreateFormProps> = ({
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
  const t = useT();

  const { renderedDateRecurrence } = useDateRecurrence({
    startDate: fromDate,
    latestDate,
    recurrence,
    onChange: (changedRecurrence) => setRecurrence(changedRecurrence),
  });

  return (
    <StyledDateCreateFormWrapper>
      <EntryFormWrapper fullWidth reducedVerticalpadding>
        <EntryFormContainer noPadding fullWidth>
          <DateFormTime
            {...{
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
        <EntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.recurrence.title')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>{renderedDateRecurrence}</FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.title')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label={t('general.german') as string}
                value={titleGerman}
                onChange={(e) => setTitleGerman(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label={t('general.english') as string}
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Info color={InfoColor.grey} title={t('date.titleInfoTitle') as string} noMaxWidth>
                {t('general.german')}: {offerTitles[Language.de]}
                {titleGerman ? ` - ${titleGerman}` : ''}
                <br />
                {t('general.english')}: {offerTitles[Language.en]}
                {titleEnglish ? ` - ${titleEnglish}` : ''}
              </Info>
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.roomInfo')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label={t('general.german') as string}
                value={roomGerman}
                onChange={(e) => setRoomGerman(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half}>
              <Input
                type={InputType.text}
                label={t('general.english') as string}
                value={roomEnglish}
                onChange={(e) => setRoomEnglish(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        <EntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.additionalLinks')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <Input
                type={InputType.url}
                label={t('date.ticketLink') as string}
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
      </EntryFormWrapper>
    </StyledDateCreateFormWrapper>
  );
};

const StyledDateCreateBottomBar = styled.div`
  padding: 0.75rem;
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  background: var(--grey-200);
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--grey-400);

  ${mq(Breakpoint.wide)} {
    padding: 0.75rem 1.5rem;
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
`;

interface DateCreateProps {
  onSubmit: (date: OfferDate['data'], recurrence?: string) => void;
  offerTitles: { [key in Language]: string };
  submitDelay?: number;
}

export const DateCreate: React.FC<DateCreateProps> = ({
  onSubmit,
  offerTitles,
  submitDelay = 0,
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
    () => parseISO(`${fromDateISOString}T${fromTimeISOString}`),
    [fromDateISOString, fromTimeISOString]
  );

  const toDateTime = useMemo(
    () => parseISO(`${toDateISOString}T${toTimeISOString}`),
    [toDateISOString, toTimeISOString]
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
        attributes: {
          startsAt: fromDateTime?.toISOString(),
          endsAt: toDateTime?.toISOString(),
          status: OfferDateStatus.scheduled,
          ticketLink: ticketUrl,
        },
        relations: {
          translations: [
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.de,
                name: titleGerman,
                roomDescription: roomGerman,
              },
            },
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.en,
                name: titleEnglish,
                roomDescription: roomEnglish,
              },
            },
          ],
        },
      },
    }),
    [fromDateTime, roomEnglish, roomGerman, ticketUrl, titleEnglish, titleGerman, toDateTime]
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
    onSubmit(date?.data, recurrence);

    setTimeout(() => {
      setIsOpen(false);
      setTicketUrl('');
      setTitleGerman('');
      setTitleEnglish('');
      setRoomGerman('');
      setRoomEnglish('');
      setFromDateISOString(earliestDateISOString);
      setFromTimeISOString(startTimeISOString);
      setToDateISOString(earliestDateISOString);
      setToTimeISOString(startPlusOneHourTimeISOString);
      setRecurrence(undefined);
    }, submitDelay);
  }, [
    recurrence,
    date,
    onSubmit,
    setIsOpen,
    earliestDateISOString,
    startTimeISOString,
    startPlusOneHourTimeISOString,
    submitDelay,
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
