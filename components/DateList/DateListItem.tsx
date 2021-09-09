import styled from '@emotion/styled';
import { add, compareAsc, format, formatISO9075, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Language } from '../../config/locale';
import { OfferDate, OfferDateStatus } from '../../lib/api/types/offer';
import { useT } from '../../lib/i18n';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Breakpoint, useBreakpointOrWider } from '../../lib/WindowService';
import { Checkbox } from '../checkbox';
import { EntryFormHead, EntryFormHeadSize } from '../EntryForm/EntryFormHead';
import { mq } from '../globals/Constants';
import { Info, InfoColor } from '../info';
import { Input, InputType } from '../input';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { Select, SelectSize } from '../select';
import { DateListRow } from './DateListRow';

const StyledDateListItemBody = styled.div`
  display: grid;
  padding: 0.75rem;

  ${mq(Breakpoint.mid)} {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 0.75rem;
    row-gap: 0.375rem;
  }

  ${mq(Breakpoint.ultra)} {
    padding: 1.5rem;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1.5rem;
    row-gap: 0.75rem;
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
  offerTitles: { [key in Language]: string };
}

export const DateListItem: React.FC<DateListItemProps> = ({
  date,
  lastRow,
  checked,
  setChecked,
  editable,
  offerTitles,
}: DateListItemProps) => {
  const uid = usePseudoUID();
  const language = useLanguage();
  const t = useT();
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);

  const translations = date?.data?.relations?.translations;
  const currentTranslation = translations ? getTranslation(language, translations) : undefined;
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

  const ticketUrl = attributes.ticketLink;

  const toTimeValid = useMemo(
    () => compareAsc(fromDateTime, toDateTime) === -1,
    [fromDateTime, toDateTime]
  );

  const titleGerman = useMemo(
    () => getTranslation(Language['de'], translations)?.attributes?.name,
    [translations]
  );

  const titleEnglish = useMemo(
    () => getTranslation(Language['en'], translations)?.attributes?.name,
    [translations]
  );

  const roomGerman = useMemo(
    () => getTranslation(Language['de'], translations)?.attributes?.room,
    [translations]
  );

  const roomEnglish = useMemo(
    () => getTranslation(Language['en'], translations)?.attributes?.room,
    [translations]
  );

  return (
    <DateListRow
      from={attributes.from}
      to={attributes.to}
      allDay={attributes.allDay}
      status={attributes.status}
      title={currentTranslation?.attributes?.name}
      lastRow={lastRow}
      checked={checked}
      onChange={(checked) => {
        if (editable) {
          setChecked(checked);
        }
      }}
      body={
        <StyledDateListItemBody>
          <StyledDateListItemContainer columns={isUltraOrWider ? 2 : 3}>
            <EntryFormHead title="Zeit" size={EntryFormHeadSize.small} />
            <FormGrid>
              <FormItem width={FormItemWidth.full} alignSelf="flex-start" childrenFlexGrow="0">
                <Checkbox
                  id={`checkbox-${uid}`}
                  label="ist ganztägig"
                  checked={attributes.allDay}
                  onChange={(e) => undefined}
                  disabled={!editable}
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
                  disabled={!editable}
                />
                {!attributes.allDay && (
                  <Input
                    type={InputType.time}
                    label="Uhrzeit"
                    value={format(fromDate, 'HH:mm')}
                    onChange={(e) => undefined}
                    disabled={!editable}
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
                  disabled={!editable}
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
                    disabled={!editable}
                  />
                )}
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={isUltraOrWider ? 1 : 3}>
            <EntryFormHead
              title="Status"
              size={EntryFormHeadSize.small}
              id={`entryformhead-${uid}`}
            />
            <FormGrid>
              <FormItem width={isUltraOrWider ? FormItemWidth.full : FormItemWidth.half}>
                <Select
                  id={`entryformstatusselect-${uid}`}
                  value={attributes.status}
                  ariaLabelledby={`entryformhead-${uid}`}
                  size={SelectSize.big}
                  disabled={!editable}
                >
                  <option value={OfferDateStatus.confirmed}>{t('dateList.confirmed')}</option>
                  <option value={OfferDateStatus.cancelled}>{t('dateList.cancelled')}</option>
                </Select>
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead title="Titel" size={EntryFormHeadSize.small} />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label="Titel deutsch"
                  value={titleGerman}
                  onChange={(e) => undefined}
                  disabled={!editable}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label="Titel english"
                  value={titleEnglish}
                  onChange={(e) => undefined}
                  disabled={!editable}
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
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead title="Rauminformationen" size={EntryFormHeadSize.small} />
            <FormGrid>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label="Rauminformation Deutsch"
                  value={roomGerman}
                  onChange={(e) => undefined}
                  disabled={!editable}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.text}
                  label="Rauminformation Englisch"
                  value={roomEnglish}
                  onChange={(e) => undefined}
                  disabled={!editable}
                />
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead title="Weiterführende Links (optional)" />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <Input
                  type={InputType.url}
                  label="Ticketlink"
                  value={ticketUrl}
                  onChange={(e) => undefined}
                  disabled={!editable}
                />
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
        </StyledDateListItemBody>
      }
      hideCheckboxes={!editable}
    />
  );
};
