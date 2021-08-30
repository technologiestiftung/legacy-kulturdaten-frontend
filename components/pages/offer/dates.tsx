import { useState } from 'react';
import { CategoryEntryPage } from '../../../lib/categories';
import { usePseudoUID } from '../../../lib/uid';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { RadioVariant, RadioVariantOptionParagraph } from '../../RadioVariant';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';

export const OfferDatesPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const [value, setValue] = useState<string>('a');
  const uid = usePseudoUID();

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
                  setValue(value);
                }}
                options={[
                  {
                    value: 'a',
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
                    value: 'b',
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
      </EntryFormWrapper>
    </>
  );
};
