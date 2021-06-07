import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React, { useRef } from 'react';
import { Tooltip } from '.';
import { Tooltip as NewTooltip } from './new';

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

const ScrollWrapper = styled.div`
  height: 400px;
  width: calc(100% - 30px);
  border: 1px solid var(--black);
  overflow-x: hidden;
  overflow-y: scroll;
  margin-left: 30px;
`;

const StyledTestContent = styled.div`
  width: 100%;
  display: grid;
  padding: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1.5rem;
  column-gap: 1.5rem;
`;

const StyledTestContentBox = styled.div`
  height: 20rem;
  width: 100%;
  border: 1px solid var(--grey-400);
  padding: 1.5rem;
  font-weight: 700;
  border-radius: 0.75rem;
`;

export const TooltipStory: Story = () => (
  <TestWrapper>
    <Tooltip label="Open tooltip" position="topLeft">
      Hello, Tooltip!
    </Tooltip>
  </TestWrapper>
);

TooltipStory.storyName = 'Tooltip';

const StyledH2 = styled.h2`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.75rem;
  position: relative;
  display: flex;
`;

export const NewTooltipStory: Story = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <br />
      <br />
      <br />
      <ScrollWrapper ref={wrapperRef}>
        <StyledTestContent>
          {[...Array(4)].map((i, index) => (
            <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
          ))}
        </StyledTestContent>
        <div>
          <StyledH2>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy{' '}
            <NewTooltip parentNodeRef={wrapperRef}>Hello, Tooltip!</NewTooltip>
          </StyledH2>
        </div>
        <StyledTestContent>
          {[...Array(6)].map((i, index) => (
            <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
          ))}
        </StyledTestContent>
      </ScrollWrapper>
    </>
  );
};

NewTooltipStory.storyName = 'New Tooltip';
