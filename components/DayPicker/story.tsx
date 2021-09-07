import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
import { DayPicker } from '.';

export default {
  title: 'Day Picker',
};

const StoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  align-items: flex-start;
`;

const EmbeddedComponent: React.FC = () => {
  const [state, setState] = useState([]);

  return (
    <StoryWrapper>
      <DayPicker value={state} onChange={setState} min={1} />
    </StoryWrapper>
  );
};

export const DayPickerDefaultStory: Story = () => <EmbeddedComponent />;
