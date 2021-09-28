import { css } from '@emotion/react';
import { compareAsc, compareDesc } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { languages } from '../../../config/locales';
import { dummyArchivedDates, dummyDates } from '../../../dummy-data/dates';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { Offer, OfferDate, OfferMode } from '../../../lib/api/types/offer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { getTranslation } from '../../../lib/translations';
import { usePseudoUID } from '../../../lib/uid';
import { Breakpoint } from '../../../lib/WindowService';
import { useCollapsable } from '../../collapsable';
import { DateCreate } from '../../DateCreate';
import { useDateList } from '../../DateList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { mq } from '../../globals/Constants';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';

const customFormItemCss = css`
  margin: 0 -0.75rem;

  ${mq(Breakpoint.mid)} {
    margin: 0;
  }
`;

export const OfferDatesPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const t = useT();
  const [value, setValue] = useState<OfferMode>(OfferMode.scheduled);
  const uid = usePseudoUID();
  const { entry } = useEntry<Offer, OfferShow>(category, query);

  const [dates, setDates] = useState<OfferDate['data'][]>(entry?.data?.relations?.dates);
  const datesFromApi = useMemo(
    () => entry?.data?.relations?.dates,
    [entry?.data?.relations?.dates]
  );
  const [archivedDates, setArchivedDates] = useState<OfferDate['data'][]>(
    dummyArchivedDates?.map((date) => date?.data)
  );

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

  const { renderedDateList } = useDateList({ dates, offerTitles });

  const { renderedDateList: renderedArchivedDateList } = useDateList({
    dates: archivedDates.sort((firstDate, secondDate) =>
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

  return (
    <>
      {renderedEntryHeader}
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
                    onSubmit={(date) => {
                      console.log(date);
                      setDates(
                        [date, ...dates].sort((firstDate, secondDate) =>
                          compareAsc(
                            new Date(firstDate.attributes.startsAt),
                            new Date(secondDate.attributes.startsAt)
                          )
                        )
                      );
                    }}
                    offerTitles={offerTitles}
                  />
                </FormItem>
                <FormItem width={FormItemWidth.full} css={customFormItemCss}>
                  {renderedDateList}
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
