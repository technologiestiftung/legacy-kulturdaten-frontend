import { css } from '@emotion/react';
import { compareDesc } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { languages } from '../../../config/locales';
import { useApiCall } from '../../../lib/api';
import { OfferDateCreate, offerDateCreateFactory } from '../../../lib/api/routes/offer/date/create';
import { OfferDateUpdate, offerDateUpdateFactory } from '../../../lib/api/routes/offer/date/update';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { Offer, OfferDate, OfferMode } from '../../../lib/api/types/offer';
import { CategoryEntryPage, Order, useEntry, useOfferDateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { getTranslation } from '../../../lib/translations';
import { usePseudoUID } from '../../../lib/uid';
import { Breakpoint } from '../../../lib/WindowService';
import { useCollapsable } from '../../collapsable';
import { DateCreate } from '../../DateCreate';
import { useDateList } from '../../DateList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { EntryListPagination } from '../../EntryList/EntryListPagination';
import { mq } from '../../globals/Constants';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { RadioSwitch } from '../../RadioSwitch';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { Select } from '../../select';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';

const customFormItemCss = css`
  margin: 0 -0.75rem;

  ${mq(Breakpoint.mid)} {
    margin: 0;
  }
`;

const entriesPerPage = 25;

export const OfferDatesPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const t = useT();
  const [value, setValue] = useState<OfferMode>(OfferMode.scheduled);
  const uid = usePseudoUID();
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const call = useApiCall();
  const [currentPage, setCurrentPage] = useState(1);
  const pseudoUID = usePseudoUID();
  const loadingScreen = useLoadingScreen();
  const [dates, setDates] = useState<OfferDate['data'][]>(entry?.data?.relations?.dates);
  const [datesNotPristineList, setDatesNotPristineList] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState('startsAt');
  const [order, setOrder] = useState(Order.ASC);

  const {
    data: datesFromApi,
    mutate: mutateDateList,
    meta: metaDateList,
  } = useOfferDateList(entry?.data?.id, currentPage, entriesPerPage, [['past', 'false']], {
    key: sortKey,
    order,
  });

  const { data: archivedDates } = useOfferDateList(entry?.data?.id, 0, 1000, [['past', 'true']], {
    key: 'startsAt',
    order: Order.DESC,
  });

  const translations = entry?.data?.relations?.translations;

  useEffect(() => {
    if (datesFromApi) {
      setDates(datesFromApi);
    }
  }, [datesFromApi]);

  const offerTitles = useMemo<{ [key in Language]: string }>(() => {
    const languageNamePairs = Object.keys(languages).map<[Language, string]>((lang: Language) => {
      const trans = getTranslation(lang, translations, true);
      return [lang, trans?.attributes?.name];
    });

    return Object.fromEntries(languageNamePairs) as { [key in Language]: string };
  }, [translations]);

  const { renderedDateList } = useDateList({
    dates,
    offerTitles,
    onChange: (changedDates, changedDateId) => {
      setDates(changedDates);
      setDatesNotPristineList([
        ...datesNotPristineList.filter((id) => id !== changedDateId),
        changedDateId,
      ]);
    },
  });

  const { renderedDateList: renderedArchivedDateList } = useDateList({
    dates: archivedDates?.sort((firstDate, secondDate) =>
      compareDesc(new Date(firstDate.attributes.startsAt), new Date(secondDate.attributes.startsAt))
    ),
    editable: false,
    offerTitles,
  });

  const { renderedCollapsable, isCollapsed, setIsCollapsed } = useCollapsable(
    <FormGrid>
      <FormItem width={FormItemWidth.full} css={customFormItemCss}>
        {renderedArchivedDateList}
      </FormItem>
    </FormGrid>,
    undefined,
    undefined,
    true
  );

  const pristine = useMemo(() => datesNotPristineList.length === 0, [datesNotPristineList]);

  const submitDateList = useCallback(async () => {
    for (let i = 0; i < dates.length; i += 1) {
      const date = dates[i];

      const id = date.id;

      if (datesNotPristineList.includes(id)) {
        try {
          const resp = await call<OfferDateUpdate>(offerDateUpdateFactory, {
            offerId: entry.data.id,
            dateId: id,
            offerDate: {
              ...date,
              relations: {
                ...date.relations,
                translations: date.relations?.translations?.map(
                  (translation) => translation.attributes
                ),
              },
            },
          });

          if (resp.status === 200) {
            mutateDateList();
          } else {
            console.error(resp);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setDatesNotPristineList([]);
  }, [call, dates, datesNotPristineList, entry?.data?.id, mutateDateList]);

  return (
    <>
      {renderedEntryHeader}
      <Save
        onClick={async () => {
          submitDateList();
        }}
        active={!pristine}
        date={formattedDate}
        valid={true}
        hint={false}
      />
      <EntryFormWrapper>
        <EntryFormContainer>
          <EntryFormHead title={t('date.mode.title') as string} id={`radio-${uid}`} />
          <FormGrid>
            <FormItem width={FormItemWidth.full}>
              <RadioVariant
                labelledBy={`radio-${uid}`}
                value={value}
                name="test-radio-variant"
                onChange={(value) => {
                  setValue(value as OfferMode);
                }}
                options={[
                  {
                    value: OfferMode.permanent,
                    label: t('date.mode.permanent.label') as string,
                    children: [
                      <RadioVariantOptionParagraph key={0}>
                        {t('date.mode.permanent.description1')}
                      </RadioVariantOptionParagraph>,
                      <RadioVariantOptionParagraph key={1}>
                        {t('date.mode.permanent.description2')}
                      </RadioVariantOptionParagraph>,
                    ],
                  },
                  {
                    value: OfferMode.scheduled,
                    label: t('date.mode.scheduled.label') as string,
                    children: [
                      <RadioVariantOptionParagraph key={0}>
                        {t('date.mode.scheduled.description1')}
                      </RadioVariantOptionParagraph>,
                      <RadioVariantOptionParagraph key={1}>
                        {t('date.mode.scheduled.description2')}
                      </RadioVariantOptionParagraph>,
                    ],
                  },
                ]}
              />
            </FormItem>
          </FormGrid>
        </EntryFormContainer>
        {value === OfferMode.scheduled && (
          <>
            <EntryFormContainer>
              <EntryFormHead title={t('date.currentDates') as string} />
              <FormGrid>
                <FormItem width={FormItemWidth.full}>
                  <DateCreate
                    onSubmit={async (date, recurrence) => {
                      loadingScreen(
                        t('dateCreate.loading'),
                        async () => {
                          try {
                            const filteredTranslations = date.relations?.translations?.filter(
                              (translation) =>
                                translation?.attributes.name?.length > 0 ||
                                translation?.attributes.roomDescription?.length > 0
                            );

                            const resp = await call<OfferDateCreate>(offerDateCreateFactory, {
                              offerId: entry.data.id,
                              date: {
                                ...date,
                                attributes: {
                                  ...date.attributes,
                                },
                                relations: {
                                  ...date.relations,
                                  translations:
                                    filteredTranslations.length > 0
                                      ? filteredTranslations.map(
                                          (translation) => translation.attributes
                                        )
                                      : undefined,
                                },
                                meta: recurrence
                                  ? {
                                      recurrenceRule: recurrence,
                                      startsAt: date?.attributes?.startsAt,
                                      endsAt: date?.attributes?.endsAt,
                                    }
                                  : undefined,
                              },
                            });

                            if (resp.status === 200) {
                              mutateDateList();
                              return { success: true };
                            }
                          } catch (e) {
                            console.error(e);
                            return { success: false, error: t('general.serverProblem') };
                          }
                        },
                        t('general.takeAFewSeconds')
                      );
                    }}
                    offerTitles={offerTitles}
                    submitDelay={500}
                  />
                </FormItem>
                <FormItem
                  width={FormItemWidth.full}
                  css={css`
                    align-items: flex-end;
                  `}
                >
                  <Select
                    id={`entry-sort-${pseudoUID}`}
                    label={t('general.sort') as string}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSortKey(e.target.value);
                    }}
                    value={sortKey}
                  >
                    <option value="startsAt">{t('date.sort.startsAt')}</option>
                    <option value="endsAt">{t('date.sort.endsAt')}</option>
                  </Select>
                  <RadioSwitch
                    value={order}
                    name={`entry-order-${pseudoUID}`}
                    onChange={(value) => {
                      setCurrentPage(1);
                      setOrder(value as Order);
                    }}
                    options={[
                      {
                        value: Order.ASC,
                        label: t('general.ascending') as string,
                        ariaLabel: t('general.ascendingAriaLabel') as string,
                        icon: 'ArrowUp',
                      },
                      {
                        value: Order.DESC,
                        label: t('general.descending') as string,
                        ariaLabel: t('general.descendingAriaLabel') as string,
                        icon: 'ArrowDown',
                      },
                    ]}
                  />
                </FormItem>
                <FormItem width={FormItemWidth.full} css={customFormItemCss}>
                  {renderedDateList}
                </FormItem>
                <FormItem width={FormItemWidth.full}>
                  {metaDateList?.pages.lastPage > 1 && (
                    <EntryListPagination
                      currentPage={currentPage}
                      lastPage={metaDateList?.pages.lastPage}
                      totalEntries={metaDateList?.pages.total}
                      entriesPerPage={entriesPerPage}
                      nextPage={() =>
                        currentPage < metaDateList?.pages.lastPage
                          ? setCurrentPage(currentPage + 1)
                          : undefined
                      }
                      previousPage={() =>
                        currentPage > 1 ? setCurrentPage(currentPage - 1) : undefined
                      }
                      goToPage={(index: number) =>
                        index <= metaDateList?.pages.lastPage ? setCurrentPage(index) : undefined
                      }
                      expanded={true}
                      noHorizontalPadding
                    />
                  )}
                </FormItem>
              </FormGrid>
            </EntryFormContainer>
            <EntryFormContainer>
              <EntryFormHead
                title={t('date.archivedDates') as string}
                expander={{
                  onClick: () => {
                    setIsCollapsed(!isCollapsed);
                  },
                  isExpanded: !isCollapsed,
                }}
              />
              {renderedCollapsable}
            </EntryFormContainer>
          </>
        )}
      </EntryFormWrapper>
    </>
  );
};
