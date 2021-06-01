import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { Textarea } from '.';

export default {
  title: 'Textarea',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.5rem;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const StyledCell = styled.div`
  width: 100%;
`;

export const TextareaDefaultStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Textarea
        id="test"
        rows={8}
        placeholder="Please enter some text"
        label="An example textarea"
      />
    </StyledCell>
  </StyledTestWrapper>
);
