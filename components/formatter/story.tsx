import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React from 'react';
import { Formatter } from '.';

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
    <Formatter>{JSON.stringify({ a: 1, b: 2, c: 3 }, null, 2)}</Formatter>
  </StyledTestWrapper>
);
StatusBarStory.storyName = 'Status Bar';
