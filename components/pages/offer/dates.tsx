import { css } from '@emotion/react';
import { compareDesc } from 'date-fns';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { languages } from '../../../config/locales';
import { useApiCall } from '../../../lib/api';
import { OfferDateCreate, offerDateCreateFactory } from '../../../lib/api/routes/offer/date/create';
import { OfferDateUpdate, offerDateUpdateFactory } from '../../../lib/api/routes/offer/date/update';
import { OfferDelete, offerDeleteFactory } from '../../../lib/api/routes/offer/delete';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { OfferUpdate } from '../../../lib/api/routes/offer/update';
import { Offer, OfferDate } from '../../../lib/api/types/offer';
import { CategoryEntryPage, Order, useEntry, useOfferDateList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { getTranslation } from '../../../lib/translations';
import { usePseudoUID } from '../../../lib/uid';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { Breakpoint, WindowContext } from '../../../lib/WindowService';
import { useCollapsable } from '../../collapsable';
import { DateCreate } from '../../DateCreate';
import { useDateList } from '../../DateList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { EntryListPagination } from '../../EntryList/EntryListPagination';
import { mq } from '../../globals/Constants';
import { useLoadingScreen } from '../../Loading/LoadingScreen';
import { usePublish } from '../../Publish';
import { RadioSwitch } from '../../RadioSwitch';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { Select } from '../../select';
import { EntryFormHook } from '../helpers/form';
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

const useIsPermanentForm: EntryFormHook = ({ category, query }) => {
  const { entry, mutate } = useEntry<Offer, OfferShow>(category, query);
  const call = useApiCall();
  const t = useT();
  const uid = usePseudoUID();

  const [isPermanent, setIsPermanent] = useState<boolean>();
  const initialIsPermanent = useMemo(
    () => entry?.data?.attributes?.isPermanent,
    [entry?.data?.attributes?.isPermanent]
  );

  const pristine = useMemo(
    () => isPermanent === initialIsPermanent,
    [isPermanent, initialIsPermanent]
  );

  useEffect(() => {
    if (typeof initialIsPermanent === 'boolean' && typeof isPermanent === 'undefined') {
      setIsPermanent(initialIsPermanent);
    }
  }, [initialIsPermanent, isPermanent]);

  const renderedForm = (
    <div>
      <EntryFormHead title={t('date.mode.title') as string} id={`radio-${uid}`} />
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <RadioVariant
            labelledBy={`radio-${uid}`}
            value={String(isPermanent)}
            name="test-radio-variant"
            onChange={(value) => {
              setIsPermanent(Boolean(value === 'true'));
            }}
            options={[
              {
                value: 'true',
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
                value: 'false',
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
    </div>
  );

  return {
    renderedForm,
    submit: async () => {
      if (!pristine) {
        try {
          const resp = await call<OfferUpdate>(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              attributes: { isPermanent },
            },
          });

          if (resp.status === 200) {
            mutate();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setIsPermanent(initialIsPermanent);
    },
    valid: true,
    value: isPermanent,
  };
};

export const OfferDatesPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const t = useT();
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
  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm: isPermanentForm,
    submit: isPermanentSubmit,
    pristine: isPermanentPristine,
    value: isPermanentValue,
    reset: isPermanentReset,
  } = useIsPermanentForm({
    category,
    query,
    loaded,
  });

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

  const { renderedDateList, checkedDateIds, setCheckedDateIds } = useDateList({
    dates,
    offerTitles,
    onChange: (changedDates, changedDateId) => {
      setDates(changedDates);
      setDatesNotPristineList([
        ...datesNotPristineList.filter((id) => id !== changedDateId),
        changedDateId,
      ]);
    },
    onDelete: (dateIds) => {
      if (
        confirm(
          t('general.deleting.confirm', {
            name: t(
              dateIds?.length > 1
                ? 'general.deleting.date.plural'
                : 'general.deleting.date.singular'
            ) as string,
          }) as string
        )
      ) {
        loadingScreen(
          t('general.deleting.loading'),
          async () => {
            try {
              const resp = await call<OfferDelete>(offerDeleteFactory, {
                id: entry.data.id,
                entry: {
                  relations: {
                    dates: dateIds,
                  },
                },
              });

              if (resp.status === 200) {
                setCheckedDateIds(
                  checkedDateIds.filter((dateId) => !dateIds.includes(parseInt(dateId, 10)))
                );
                mutateDateList();
                return { success: true };
              }

              return { success: false, error: t('general.serverProblem') };
            } catch (e) {
              console.error(e);

              return { success: false, error: t('general.serverProblem') };
            }
          },
          t('general.takeAFewSeconds')
        );
      }
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
                translations:
                  date.relations?.translations?.length > 0
                    ? date.relations.translations
                    : undefined,
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

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    isPermanentReset();
  });

  const onSave = useCallback(async () => {
    isPermanentSubmit();
    submitDateList();
  }, [isPermanentSubmit, submitDateList]);

  const { renderedPublish } = usePublish({
    category,
    query,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <Save
        onClick={onSave}
        active={!pristine || !isPermanentPristine}
        date={formattedDate}
        valid={true}
        hint={false}
      />
      <EntryFormWrapper>
        <EntryFormContainer>{isPermanentForm}</EntryFormContainer>
        {!isPermanentValue && (
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
                                      ? filteredTranslations
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
