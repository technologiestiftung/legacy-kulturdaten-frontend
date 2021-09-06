import { useMemo, useState } from 'react';
import { dummyDates } from '../../../dummy-data/dates';
import { OfferShow } from '../../../lib/api/routes/offer/show';
import { Offer } from '../../../lib/api/types/offer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useLanguage } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { usePseudoUID } from '../../../lib/uid';
import { DateCreate } from '../../DateCreate';
import { useDateList } from '../../DateList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';

enum OfferDateType {
  permanent = 'permanent',
  scheduled = 'scheduled',
}

export const OfferDatesPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const [value, setValue] = useState<OfferDateType>(OfferDateType.permanent);
  const uid = usePseudoUID();
  const { entry } = useEntry<Offer, OfferShow>(category, query);
  const language = useLanguage();

  const currentTranslation = useMemo(
    () => getTranslation(language, entry?.data?.relations?.translations, true),
    [entry?.data?.relations?.translations, language]
  );

  const { renderedDateList } = useDateList({ dates: dummyDates });

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
                  setValue(value as OfferDateType);
                }}
                options={[
                  {
                    value: OfferDateType.permanent,
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
                    value: OfferDateType.scheduled,
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
        {value === OfferDateType.scheduled && (
          <EntryFormContainer>
            <EntryFormHead title="Termine" />
            <FormGrid>
              <FormItem width={FormItemWidth.full}>
                <DateCreate
                  onSubmit={() => undefined}
                  offerTitle={currentTranslation?.attributes?.name}
                />
              </FormItem>
              <FormItem width={FormItemWidth.full}>{renderedDateList}</FormItem>
            </FormGrid>
          </EntryFormContainer>
        )}
      </EntryFormWrapper>
    </>
  );
};
