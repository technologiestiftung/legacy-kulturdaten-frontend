import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { DateCreate } from '.';
import { Language } from '../../config/locale';

export default {
  title: 'Date Create',
};

const StoryWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const DateCreateDefaultStory: Story = () => (
  <StoryWrapper>
    <DateCreate
      onSubmit={() => undefined}
      offerTitles={{
        [Language.de]: 'Angebot',
        [Language.en]: 'Offer',
      }}
    />
  </StoryWrapper>
);
