import styled from '@emotion/styled';
import { add, compareAsc, format, formatISO9075, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Language } from '../../config/locale';
import { contentLanguages, languageTranslationKeys } from '../../config/locales';
import { OfferDate, OfferDateStatus, OfferDateTranslation } from '../../lib/api/types/offer';
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
  date: OfferDate['data'];
  onChange: (date: OfferDate['data']) => void;
  lastRow: boolean;
  editable: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  offerTitles: { [key in Language]: string };
}

export const DateListItem: React.FC<DateListItemProps> = ({
  date,
  onChange,
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

  const translations = date?.relations?.translations;
  const currentTranslation = translations ? getTranslation(language, translations) : undefined;
  const dateId = date?.id;

  const attributes = date?.attributes;

  const isAllDay = attributes?.isAllDay;
  const fromDate = useMemo(
    () => (attributes.startsAt ? new Date(attributes.startsAt) : undefined),
    [attributes.startsAt]
  );
  const toDate = useMemo(
    () =>
      attributes.endsAt
        ? new Date(attributes.endsAt)
        : fromDate
        ? add(fromDate, { hours: 1 })
        : undefined,
    [attributes.endsAt, fromDate]
  );
  const today = new Date();
  const earliestDate = today;
  const latestDate = add(today, { years: 1 });

  const fromDateISOString = useMemo(
    () => (fromDate ? formatISO9075(fromDate, { representation: 'date' }) : ''),
    [fromDate]
  );
  const fromTimeISOString = useMemo(() => (fromDate ? format(fromDate, 'HH:mm') : ''), [fromDate]);
  const toDateISOString = useMemo(
    () => (toDate ? formatISO9075(toDate, { representation: 'date' }) : ''),
    [toDate]
  );
  const toTimeISOString = useMemo(() => (toDate ? format(toDate, 'HH:mm') : ''), [toDate]);

  const fromDateTime = useMemo(
    () => parseISO(`${fromDateISOString}T${!isAllDay ? fromTimeISOString : '00:00'}`),
    [isAllDay, fromDateISOString, fromTimeISOString]
  );

  const toDateTime = useMemo(
    () => parseISO(`${toDateISOString}T${!isAllDay ? toTimeISOString : '00:00'}`),
    [isAllDay, toDateISOString, toTimeISOString]
  );

  const toDateValid = useMemo(() => compareAsc(fromDate, toDate) < 1, [fromDate, toDate]);

  const toTimeValid = useMemo(
    () => compareAsc(fromDateTime, toDateTime) === -1,
    [fromDateTime, toDateTime]
  );

  return fromDate ? (
    <DateListRow
      from={attributes.startsAt}
      to={attributes.endsAt}
      isAllDay={attributes.isAllDay}
      status={attributes.status}
      title={currentTranslation?.attributes?.name}
      lastRow={lastRow}
      checked={checked}
      onChange={(checked) => {
        if (editable) {
          setChecked(checked);
        }
      }}
      disabled={!editable}
      body={
        <StyledDateListItemBody>
          <StyledDateListItemContainer columns={isUltraOrWider ? 2 : 3}>
            <EntryFormHead title={t('date.time') as string} size={EntryFormHeadSize.small} />
            <FormGrid>
              <FormItem width={FormItemWidth.full} alignSelf="flex-start" childrenFlexGrow="0">
                <Checkbox
                  id={`checkbox-${uid}`}
                  label={t('date.allDay') as string}
                  checked={attributes.isAllDay}
                  onChange={(e) =>
                    onChange({
                      ...date,
                      attributes: {
                        ...date.attributes,
                        isAllDay: e.target.checked,
                      },
                    })
                  }
                  disabled={!editable}
                />
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.date}
                  label={t('date.from') as string}
                  value={formatISO9075(fromDate, { representation: 'date' })}
                  onChange={(e) =>
                    onChange({
                      ...date,
                      attributes: {
                        ...date.attributes,
                        startsAt: `${e.target.value}T${format(fromDate, 'HH:mm')}`,
                      },
                    })
                  }
                  min={formatISO9075(today, { representation: 'date' })}
                  max={formatISO9075(add(today, { years: 1 }), { representation: 'date' })}
                  disabled={!editable}
                />
                {!attributes.isAllDay && (
                  <Input
                    type={InputType.time}
                    label={t('date.clock') as string}
                    value={format(fromDate, 'HH:mm')}
                    onChange={(e) =>
                      onChange({
                        ...date,
                        attributes: {
                          ...date.attributes,
                          startsAt: `${formatISO9075(fromDate, { representation: 'date' })}T${
                            e.target.value
                          }`,
                        },
                      })
                    }
                    disabled={!editable}
                  />
                )}
              </FormItem>
              <FormItem width={FormItemWidth.half}>
                <Input
                  type={InputType.date}
                  label={t('date.to') as string}
                  value={formatISO9075(toDate, { representation: 'date' })}
                  onChange={(e) =>
                    onChange({
                      ...date,
                      attributes: {
                        ...date.attributes,
                        endsAt: `${e.target.value}T${format(toDate, 'HH:mm')}`,
                      },
                    })
                  }
                  min={formatISO9075(today, { representation: 'date' })}
                  max={formatISO9075(latestDate, { representation: 'date' })}
                  valid={toDateValid}
                  error={!toDateValid ? (t('date.toDateInvalid') as string) : undefined}
                  disabled={!editable}
                />
                {!isAllDay && (
                  <Input
                    type={InputType.time}
                    label={t('date.clock') as string}
                    value={toTimeISOString}
                    onChange={(e) =>
                      onChange({
                        ...date,
                        attributes: {
                          ...date.attributes,
                          endsAt: `${formatISO9075(toDate, { representation: 'date' })}T${
                            e.target.value
                          }`,
                        },
                      })
                    }
                    min={
                      compareAsc(parseISO(fromDateISOString), parseISO(toDateISOString)) === 0
                        ? format(add(fromDateTime, { minutes: 1 }), 'HH:mm')
                        : undefined
                    }
                    valid={toTimeValid}
                    error={!toTimeValid ? (t('date.toTimeInvalid') as string) : undefined}
                    disabled={!editable}
                  />
                )}
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={isUltraOrWider ? 1 : 3}>
            <EntryFormHead
              title={t('date.status') as string}
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
                  onChange={(e) =>
                    onChange({
                      ...date,
                      attributes: {
                        ...date.attributes,
                        status: e.target.value as OfferDateStatus,
                      },
                    })
                  }
                >
                  <option value={OfferDateStatus.scheduled}>
                    {t(editable ? 'date.scheduled' : 'date.scheduledArchived')}
                  </option>
                  <option value={OfferDateStatus.cancelled}>{t('date.cancelled')}</option>
                </Select>
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead
              title={`${t('date.title')} (${t('forms.optional')})`}
              size={EntryFormHeadSize.small}
            />
            <FormGrid>
              {contentLanguages.map((language: Language, index) => {
                const currentTranslation = date.relations?.translations
                  ? getTranslation<OfferDateTranslation>(
                      language,
                      date.relations.translations,
                      false
                    )
                  : undefined;

                return (
                  <FormItem width={FormItemWidth.half} key={index}>
                    <Input
                      type={InputType.text}
                      label={`${t('date.title')} ${t(languageTranslationKeys[language])}`}
                      value={currentTranslation?.attributes?.name || ''}
                      onChange={(e) => {
                        const updatedTranslation = {
                          ...currentTranslation,
                          attributes: {
                            ...currentTranslation?.attributes,
                            language,
                            name: e.target.value,
                          },
                        };

                        const filteredTranslations =
                          date?.relations?.translations?.filter(
                            (translation) => translation.attributes?.language !== language
                          ) || [];

                        onChange({
                          attributes: date?.attributes,
                          id: date?.id,
                          type: date?.type,
                          relations: date?.relations
                            ? {
                                ...date.relations,
                                translations: [...filteredTranslations, updatedTranslation],
                              }
                            : {
                                translations: [updatedTranslation],
                              },
                        });
                      }}
                      disabled={!editable}
                    />
                  </FormItem>
                );
              })}
              <FormItem width={FormItemWidth.full}>
                <Info color={InfoColor.grey} title={t('date.titleInfoTitle') as string} noMaxWidth>
                  {contentLanguages.map((language: Language, index) => {
                    const currentTranslation = date.relations?.translations
                      ? getTranslation<OfferDateTranslation>(
                          language,
                          date.relations.translations,
                          false
                        )
                      : undefined;

                    return (
                      <span key={index}>
                        {t(languageTranslationKeys[language])}: {offerTitles[language]}
                        {currentTranslation?.attributes?.name
                          ? ` - ${currentTranslation?.attributes?.name}`
                          : ''}
                        <br />
                      </span>
                    );
                  })}
                </Info>
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead
              title={`${t('date.roomInfo')} (${t('forms.optional')})`}
              size={EntryFormHeadSize.small}
            />
            <FormGrid>
              {contentLanguages.map((language: Language, index) => {
                const currentTranslation = date.relations?.translations
                  ? getTranslation<OfferDateTranslation>(
                      language,
                      date.relations.translations,
                      false
                    )
                  : undefined;

                return (
                  <FormItem width={FormItemWidth.half} key={index}>
                    <Input
                      type={InputType.text}
                      label={`${t('date.roomInfo')} ${t(languageTranslationKeys[language])}`}
                      value={currentTranslation?.attributes?.roomDescription || ''}
                      onChange={(e) => {
                        const updatedTranslation = {
                          ...currentTranslation,
                          attributes: {
                            ...currentTranslation?.attributes,
                            language,
                            roomDescription: e.target.value,
                          },
                        };

                        const filteredTranslations =
                          date?.relations?.translations?.filter(
                            (translation) => translation.attributes?.language !== language
                          ) || [];

                        onChange({
                          attributes: date?.attributes,
                          id: date?.id,
                          type: date?.type,
                          relations: date?.relations
                            ? {
                                ...date.relations,
                                translations: [...filteredTranslations, updatedTranslation],
                              }
                            : {
                                translations: [updatedTranslation],
                              },
                        });
                      }}
                      disabled={!editable}
                    />
                  </FormItem>
                );
              })}
            </FormGrid>
          </StyledDateListItemContainer>
          <StyledDateListItemContainer columns={3}>
            <EntryFormHead
              title={`${t('date.additionalLinks')} (${t('forms.optional')})`}
              size={EntryFormHeadSize.small}
            />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <Input
                  type={InputType.url}
                  label={t('date.ticketLink') as string}
                  value={date?.attributes?.ticketUrl || ''}
                  onChange={(e) =>
                    onChange({
                      ...date,
                      attributes: {
                        ...date.attributes,
                        ticketUrl: e.target.value,
                      },
                    })
                  }
                  disabled={!editable}
                />
              </FormItem>
            </FormGrid>
          </StyledDateListItemContainer>
        </StyledDateListItemBody>
      }
      editable={editable}
    />
  ) : null;
};
