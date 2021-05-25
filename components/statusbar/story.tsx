import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { StatusBar, StatusBarSize, StatusBarVariant} from '.';

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
    <StatusBar id="statusbar-1" variant={StatusBarVariant.default} size={StatusBarSize.default} label="Label" info="Info">
      <option value="draft">Option 1</option>
      <option value="published">Option 2</option>
    </StatusBar>
  </StyledTestWrapper>
);
SelectDefaultStory.storyName = 'Status Bar size=default variant=default';

export const SelectBigStory: Story = () => (
  <StyledTestWrapper>
    <StatusBar id="statusbar-1" variant={StatusBarVariant.minimal} size={StatusBarSize.big} label="Label" info="Info">
      <option value="draft">Option 1</option>
      <option value="published">Option 2</option>
    </StatusBar>
  </StyledTestWrapper>
);
SelectDefaultStory.storyName = 'Status Bar size=big variant=minimal';