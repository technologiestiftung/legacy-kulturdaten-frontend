import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React from 'react';
import { Formatter } from '.';

export default {
  title: 'JSON Format',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const CodeFormatStory: Story = () => (
  <StyledTestWrapper>
    <Formatter content={{ a: 1, b: 2, c: { x: 'hello', y: null, z: true } }}></Formatter>
  </StyledTestWrapper>
);
CodeFormatStory.storyName = 'JSON Format';
