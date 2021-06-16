import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { StatusBar, StatusBarState } from '.';

export default {
  title: 'Status Bar',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const StatusBarStory: Story = () => (
  <StyledTestWrapper>
    <StatusBar date="01.01.1970 00:00" state={StatusBarState.published} />
    <StatusBar date="01.01.1970 00:00" state={StatusBarState.draft} />
  </StyledTestWrapper>
);
StatusBarStory.storyName = 'Status Bar';
