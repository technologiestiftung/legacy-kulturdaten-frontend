import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { StatusBar } from '.';

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

export const SelectDefaultStory: Story = () => (
  <StyledTestWrapper>
    <StatusBar id="statusbar-1" label="Label" info="Info" defaultValue="draft">
      <option value="draft">Option 1</option>
      <option value="published">Option 2</option>
    </StatusBar>
  </StyledTestWrapper>
);
SelectDefaultStory.storyName = 'Status Bar';
