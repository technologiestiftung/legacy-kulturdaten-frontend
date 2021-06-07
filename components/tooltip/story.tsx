import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React from 'react';
import { Tooltip } from '.';

export default {
  title: 'Tooltip',
};

const TestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  row-gap: 1.5rem;
  grid-template-columns: auto;
  justify-items: flex-start;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const TooltipStory: Story = () => (
  <TestWrapper>
    <Tooltip label="Open tooltip" position="topLeft">
      Hello, Tooltip!
    </Tooltip>
  </TestWrapper>
);

TooltipStory.storyName = 'Tooltip';
