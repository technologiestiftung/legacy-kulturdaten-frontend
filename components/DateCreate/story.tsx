import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { DateCreate } from '.';

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
    <DateCreate onSubmit={() => undefined} offerTitle="Offer" />
  </StoryWrapper>
);
