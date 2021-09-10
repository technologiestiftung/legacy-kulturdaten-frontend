import { css } from '@emotion/react';
import { compareAsc, compareDesc } from 'date-fns';
import { useMemo, useState } from 'react';
import { Language } from '../../../config/locale';
import { languages } from '../../../config/locales';
import { dummyArchivedDates, dummyDates } from '../../../dummy-data/dates';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { Offer, OfferDate, OfferMode } from '../../../lib/api/types/offer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
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
  const [value, setValue] = useState<OfferMode>(OfferMode.scheduled);
  const uid = usePseudoUID();
  const { entry } = useEntry<Offer, OfferShow>(category, query);

  const [dates, setDates] = useState<OfferDate[]>(dummyDates);
  const [archivedDates, setArchivedDates] = useState<OfferDate[]>(dummyArchivedDates);

  const translations = entry?.data?.relations?.translations;

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
      compareDesc(
        new Date(firstDate.data.attributes.from),
        new Date(secondDate.data.attributes.from)
      )
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
          <EntryFormHead title="Art des Angebots" id={`radio-${uid}`} />
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
                    label: 'Dauerangebot',
                    children: [
                      <RadioVariantOptionParagraph key={0}>
                        Zeitlich nicht begrenzte Angebote, wie z.B.: Dauerausstellungen, Sammlungen
                      </RadioVariantOptionParagraph>,
                      <RadioVariantOptionParagraph key={1}>
                        Dauerangebote übernehmen die Öffnungszeiten des zugewiesenen Ortes.
                      </RadioVariantOptionParagraph>,
                    ],
                  },
                  {
                    value: OfferMode.scheduled,
                    label: 'Angebot mit Terminen',
                    children: [
                      <RadioVariantOptionParagraph key={0}>
                        Zeitlich begrenzte Angebote, wie z.B.: Vorstellungen, Konzerte,
                        Filmvorführungen, Kurse
                      </RadioVariantOptionParagraph>,
                      <RadioVariantOptionParagraph key={1}>
                        Angebote mit Terminen können beliebig viele Einzel- und Serientermine
                        enthalten, mit jeweils individuellen Zeiten.
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
              <EntryFormHead title="Aktuelle Termine" />
              <FormGrid>
                <FormItem width={FormItemWidth.full}>
                  <DateCreate
                    onSubmit={(date) => {
                      console.log(date);
                      setDates(
                        [date, ...dates].sort((firstDate, secondDate) =>
                          compareAsc(
                            new Date(firstDate.data.attributes.from),
                            new Date(secondDate.data.attributes.from)
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
                title="Vergangene Termine"
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
