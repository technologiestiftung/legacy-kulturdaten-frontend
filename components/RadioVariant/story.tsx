import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
import { RadioVariant, RadioVariantOptionParagraph } from '.';
import { Breakpoint } from '../../lib/WindowService';
import { mq } from '../globals/Constants';

export default {
  title: 'Radio Variant',
};

const StoryWrapper = styled.div`
  display: flex;
  padding: 0.75rem;
  width: 100%;
  flex-direction: column;
  align-items: stretch;

  ${mq(Breakpoint.mid)} {
    padding: 1.5rem;
  }
`;

export const RadioVariantDefaultStory: Story = () => {
  const [value, setValue] = useState<string>('a');

  return (
    <StoryWrapper>
      <RadioVariant
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
                Zeitlich begrenzte Angebote, wie z.B.: Vorstellungen, Konzerte, Filmvorführungen,
                Kurse
              </RadioVariantOptionParagraph>,
              <RadioVariantOptionParagraph key={1}>
                Angebote mit Terminen können beliebig viele Einzel- und Serientermine enthalten, mit
                jeweils individuellen Zeiten.
              </RadioVariantOptionParagraph>,
            ],
          },
        ]}
      />
    </StoryWrapper>
  );
};
