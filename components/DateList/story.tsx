import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useDateList } from '.';
import { Language } from '../../config/locale';
import { dummyDates } from '../../dummy-data/dates';
import { Breakpoint } from '../../lib/WindowService';
import { contentGrid, mq } from '../globals/Constants';

export default {
  title: 'Date List',
};

const StoryWrapper = styled.div`
  padding: 2rem 0;
  ${contentGrid(8)}
`;

const StoryContainer = styled.div`
  grid-column: 1 / -1;

  ${mq(Breakpoint.mid)} {
    padding: 0 1.5rem;
  }

  ${mq(Breakpoint.wide)} {
    padding: 0;
    grid-column: 2 / -2;
  }
`;

const EmbeddedStory: React.FC = () => {
  const { renderedDateList } = useDateList({
    dates: dummyDates.map((date) => date.data),
    offerTitles: {
      [Language.de]: 'Angebotstitel',
      [Language.en]: 'Offer title',
    },
  });

  return (
    <StoryWrapper>
      <StoryContainer>{renderedDateList}</StoryContainer>
    </StoryWrapper>
  );
};

export const DateListDefaultStory: Story = () => <EmbeddedStory />;
