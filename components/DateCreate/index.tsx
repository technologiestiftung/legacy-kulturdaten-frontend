import { css } from '@emotion/react';
import { useCallback, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { Button, ButtonColor, ButtonSize } from '../button';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { StyledEntryFormContainer, EntryFormWrapper } from '../EntryForm/wrappers';
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
import { Textarea } from '../textarea';
import { usePseudoUID } from '../../lib/uid';
import { defaultTeaserTextLimit } from '../pages/helpers/form/Teaser';
import { isUrl } from '../../lib/validations';

interface DateFormTimeProps {
  earliestDate: Date;
  latestDate: Date;
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  toDateValid: boolean;
  toTimeValid: boolean;
}

export const DateFormTime: React.FC<DateFormTimeProps> = ({
  earliestDate,
  latestDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
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
            label={t('date.fromAriaDate') as string}
            value={formatISO(fromDate, { representation: 'date' })}
            onChange={(e) => {
              const newDate = parseISO(`${e.target.value}T${format(fromDate, 'HH:mm')}`);

              setFromDate(newDate);

              if (compareAsc(newDate, toDate) >= 0) {
                setToDate(add(newDate, { hours: 1 }));
              }
            }}
            min={earliestDateISOString}
            max={latestDateISOString}
          />

          <Input
            type={InputType.time}
            label={t('date.clock') as string}
            value={format(fromDate, 'HH:mm')}
            onChange={(e) => {
              const newDate = parseISO(
                `${formatISO(fromDate, { representation: 'date' })}T${e.target.value}`
              );

              setFromDate(newDate);

              if (compareAsc(newDate, toDate) >= 0) {
                setToDate(add(newDate, { hours: 1 }));
              }
            }}
          />
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          <Input
            type={InputType.date}
            label={t('date.toAriaDate') as string}
            value={formatISO(toDate, { representation: 'date' })}
            onChange={(e) => {
              setToDate(parseISO(`${e.target.value}T${format(toDate, 'HH:mm')}`));
            }}
            min={formatISO(max([earliestDate, fromDate]), { representation: 'date' })}
            max={latestDateISOString}
            valid={toDateValid}
            error={!toDateValid ? (t('date.toDateInvalid') as string) : undefined}
          />

          <Input
            type={InputType.time}
            label={t('date.clock') as string}
            ariaLabel={t('date.toAriaTime') as string}
            value={format(toDate, 'HH:mm')}
            onChange={(e) =>
              setToDate(
                parseISO(`${formatISO(toDate, { representation: 'date' })}T${e.target.value}`)
              )
            }
            min={
              compareAsc(fromDate, toDate) === 0
                ? format(add(fromDate, { minutes: 1 }), 'HH:mm')
                : undefined
            }
            valid={toTimeValid}
            error={!toTimeValid ? (t('date.toTimeInvalid') as string) : undefined}
          />
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
  registrationUrl: string;
  setRegistrationUrl: (ticketUrl: string) => void;
  titleGerman: string;
  setTitleGerman: (title: string) => void;
  titleEnglish: string;
  setTitleEnglish: (title: string) => void;
  teaserGerman: string;
  setTeaserGerman: (teaser: string) => void;
  teaserGermanEasy: string;
  setTeaserGermanEasy: (teaser: string) => void;
  teaserEnglish: string;
  setTeaserEnglish: (teaser: string) => void;
  roomGerman: string;
  setRoomGerman: (room: string) => void;
  roomEnglish: string;
  setRoomEnglish: (room: string) => void;
  recurrence: string;
  setRecurrence: (recurrence: string) => void;
  earliestDate: Date;
  latestDate: Date;
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  toDateValid: boolean;
  toTimeValid: boolean;
}

const DateCreateForm: React.FC<DateCreateFormProps> = ({
  offerTitles,
  ticketUrl,
  setTicketUrl,
  registrationUrl,
  setRegistrationUrl,
  titleGerman,
  setTitleGerman,
  titleEnglish,
  setTitleEnglish,
  teaserGerman,
  setTeaserGerman,
  teaserGermanEasy,
  setTeaserGermanEasy,
  teaserEnglish,
  setTeaserEnglish,
  roomGerman,
  setRoomGerman,
  roomEnglish,
  setRoomEnglish,
  recurrence,
  setRecurrence,
  earliestDate,
  latestDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  toDateValid,
  toTimeValid,
}: DateCreateFormProps) => {
  const t = useT();
  const uid = usePseudoUID();

  const ticketUrlValid = isUrl(ticketUrl);
  const registrationUrlValid = isUrl(registrationUrl);

  const { renderedDateRecurrence } = useDateRecurrence({
    startDate: fromDate,
    latestDate,
    recurrence,
    onChange: (changedRecurrence) => setRecurrence(changedRecurrence),
  });

  return (
    <StyledDateCreateFormWrapper>
      <EntryFormWrapper fullWidth reducedVerticalPadding>
        <StyledEntryFormContainer noPadding fullWidth>
          <DateFormTime
            {...{
              earliestDate,
              latestDate,
              fromDate,
              setFromDate,
              toDate,
              setToDate,
              toDateValid,
              toTimeValid,
            }}
          />
        </StyledEntryFormContainer>
        <StyledEntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.recurrence.title')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>{renderedDateRecurrence}</FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
        <StyledEntryFormContainer noPadding fullWidth>
          <FormGrid>
            <FormItem width={FormItemWidth.half} lang="de">
              <Input
                type={InputType.text}
                label={`${t('date.title')} ${t('general.german')} (${t('forms.optional')})`}
                value={titleGerman}
                onChange={(e) => setTitleGerman(e.target.value)}
                tooltip={t('date.titleTooltip') as string}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half} lang="en">
              <Input
                type={InputType.text}
                label={`${t('date.title')} ${t('general.english')} (${t('forms.optional')})`}
                value={titleEnglish}
                onChange={(e) => setTitleEnglish(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Info color={InfoColor.grey} title={t('date.titleInfoTitle') as string} noMaxWidth>
                <span>
                  <span>
                    {t('general.german')}: {offerTitles[Language.de]}
                    {titleGerman ? ` - ${titleGerman}` : ''}
                  </span>
                  <br/>
                  <span>
                    {t('general.english')}: {offerTitles[Language.en]}
                    {titleEnglish ? ` - ${titleEnglish}` : ''}
                  </span>
                </span>
              </Info>
            </FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
        <StyledEntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('forms.teaser')}`} />
          <FormGrid>
            <FormItem width={FormItemWidth.half} lang="de">
              <Textarea
                id={`${uid}-textarea-german`}
                label={`${t('forms.teaser')} ${t('forms.labelGerman')}`}
                value={teaserGerman || ''}
                onChange={(e) => setTeaserGerman(e.target.value)}
                rows={5}
                maxLength={defaultTeaserTextLimit}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half} lang="de">
              <Textarea
                id={`${uid}-textarea-german-easy`}
                label={`${t('forms.teaser')} ${t('forms.labelGermanEasy')}`}
                tooltip={t('forms.labelGermanEasyTooltip') as string}
                value={teaserGermanEasy || ''}
                onChange={(e) => setTeaserGermanEasy(e.target.value)}
                rows={5}
                maxLength={defaultTeaserTextLimit}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half} lang="en">
              <Textarea
                id={`${uid}-textarea-english`}
                label={`${t('forms.teaser')} ${t('forms.labelEnglish')}`}
                value={teaserEnglish || ''}
                onChange={(e) => setTeaserEnglish(e.target.value)}
                rows={5}
                maxLength={defaultTeaserTextLimit}
              />
            </FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
        <StyledEntryFormContainer noPadding fullWidth>
          <FormGrid>
            <FormItem width={FormItemWidth.half} lang="de">
              <Input
                type={InputType.text}
                label={`${t('date.roomInfo')} ${t('general.german')} (${t('forms.optional')})`}
                ariaLabel={`${t('date.roomInfo')} ${t('general.german')}`}
                value={roomGerman}
                onChange={(e) => setRoomGerman(e.target.value)}
              />
            </FormItem>
            <FormItem width={FormItemWidth.half} lang="en">
              <Input
                type={InputType.text}
                label={`${t('date.roomInfo')} ${t('general.english')} (${t('forms.optional')})`}
                ariaLabel={`${t('date.roomInfo')} ${t('general.english')}`}
                value={roomEnglish}
                onChange={(e) => setRoomEnglish(e.target.value)}
              />
            </FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
        <StyledEntryFormContainer noPadding fullWidth>
          <EntryFormHead title={`${t('date.additionalLinks')} (${t('forms.optional')})`} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <Input
                type={InputType.url}
                autoComplete="url"
                label={t('date.ticketLink') as string}
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder={t('categories.offer.form.pricing.ticketUrlPlaceholder') as string}
                error={ticketUrl.length && !ticketUrlValid ? (t('forms.urlInvalid') as string) : undefined}
              />
            </FormItem>
            <FormItem width={FormItemWidth.full}>
              <Input
                type={InputType.url}
                autoComplete="url"
                label={t('categories.offer.form.pricing.registrationUrl') as string}
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                placeholder={
                  t('categories.offer.form.pricing.registrationUrlPlaceholder') as string
                }
                error={registrationUrl.length && !registrationUrlValid ? (t('forms.urlInvalid') as string) : undefined}
              />
            </FormItem>
          </FormGrid>
        </StyledEntryFormContainer>
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

  const now = new Date();
  const earliestDate = now;
  const latestDate = add(earliestDate, { years: 1 });
  const [ticketUrl, setTicketUrl] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [titleGerman, setTitleGerman] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [teaserGerman, setTeaserGerman] = useState('');
  const [teaserGermanEasy, setTeaserGermanEasy] = useState('');
  const [teaserEnglish, setTeaserEnglish] = useState('');
  const [roomGerman, setRoomGerman] = useState('');
  const [roomEnglish, setRoomEnglish] = useState('');
  const [recurrence, setRecurrence] = useState<string>();

  const [fromDate, setFromDate] = useState<Date>(now);
  const [toDate, setToDate] = useState<Date>(add(now, { hours: 1 }));

  const toDateValid = useMemo(() => compareAsc(fromDate, toDate) < 1, [fromDate, toDate]);

  const toTimeValid = useMemo(() => compareAsc(fromDate, toDate) === -1, [fromDate, toDate]);

  const ticketUrlValid = isUrl(ticketUrl) || ticketUrl === "";
  const registrationUrlValid = isUrl(registrationUrl) || registrationUrl === "";

  const validForm = ticketUrlValid && registrationUrlValid && toDateValid && toTimeValid

  const createButton = (
    <Button key={0} color={ButtonColor.black} onClick={() => submitHandler()} disabled={!validForm}>
      {t('dateCreate.create')}
    </Button>
  );

  const date = useMemo<OfferDate>(() => {
    const newDate = {
      data: {
        attributes: {
          startsAt: fromDate?.toISOString(),
          endsAt: toDate?.toISOString(),
          status: OfferDateStatus.scheduled,
          ticketUrl: ticketUrl,
          registrationUrl: registrationUrl,
        },
        relations: {
          translations: [
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.de,
                name: titleGerman,
                teaser: teaserGerman,
                roomDescription: roomGerman,
              },
            },
            {
              type: 'offerdatetranslation',
              attributes: {
                language: Language.en,
                name: titleEnglish,
                teaser: teaserEnglish,
                roomDescription: roomEnglish,
              },
            },
          ],
        },
      },
    } as OfferDate;

    if (teaserGermanEasy?.length > 0) {
      newDate.data.relations.translations.push({
        type: 'offerdatetranslation',
        attributes: {
          language: 'de-easy' as Language,
          teaser: teaserGermanEasy,
        },
      });
    }

    return newDate;
  }, [
    fromDate,
    toDate,
    ticketUrl,
    registrationUrl,
    titleGerman,
    teaserGerman,
    roomGerman,
    titleEnglish,
    teaserEnglish,
    roomEnglish,
    teaserGermanEasy,
  ]);

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
          registrationUrl,
          setRegistrationUrl,
          titleGerman,
          setTitleGerman,
          titleEnglish,
          setTitleEnglish,
          teaserGerman,
          setTeaserGerman,
          teaserGermanEasy,
          setTeaserGermanEasy,
          teaserEnglish,
          setTeaserEnglish,
          roomGerman,
          setRoomGerman,
          roomEnglish,
          setRoomEnglish,
          recurrence,
          setRecurrence,
          earliestDate,
          latestDate,
          toDateValid,
          toTimeValid,
          fromDate,
          setFromDate,
          toDate,
          setToDate,
        }}
      />
      <StyledDateCreateBottomBar>{createButton}</StyledDateCreateBottomBar>
    </>,
    false
  );

  const submitHandler = useCallback(() => {

    onSubmit(date?.data, recurrence);

    setTimeout(() => {
      const now = new Date();
      setIsOpen(false);
      setTicketUrl('');
      setRegistrationUrl('');
      setTitleGerman('');
      setTitleEnglish('');
      setTeaserGerman('');
      setTeaserGermanEasy('');
      setTeaserEnglish('');
      setRoomGerman('');
      setRoomEnglish('');
      setRecurrence(undefined);
      setFromDate(now);
      setToDate(add(now, { hours: 1 }));
    }, submitDelay);
  }, [recurrence, date, onSubmit, setIsOpen, submitDelay]);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        size={ButtonSize.big}
        icon="Plus"
        css={css`
          width: 100%;
        `}
        color={ButtonColor.black}
      >
        {t('dateCreate.create')}
      </Button>
      {renderedOverlay}
    </div>
  );
};
