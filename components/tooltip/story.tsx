import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React, { useRef } from 'react';
import { Tooltip } from '.';
import { TooltipP } from './TooltipContent';

export default {
  title: 'Tooltip',
};

const ScrollWrapper = styled.div`
  max-height: 100%;
  height: 400px;
  width: calc(100% - 6rem);
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--grey-400);
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

const StyledH2 = styled.h2`
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: 700;
  padding: 0.75rem;
  position: relative;
  display: flex;
`;

export const TooltipStory: Story = () => {
  return (
    <>
      <StyledTestContent>
        {[...Array(4)].map((i, index) => (
          <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
        ))}
      </StyledTestContent>
      <div>
        <StyledH2>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy{' '}
          <Tooltip>
            <TooltipP>Hello, Tooltip!</TooltipP>
            <TooltipP>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.
            </TooltipP>
          </Tooltip>
        </StyledH2>
      </div>
      <StyledTestContent>
        {[...Array(6)].map((i, index) => (
          <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
        ))}
      </StyledTestContent>
    </>
  );
};

TooltipStory.storyName = 'Tooltip';

export const TooltipWrapperStory: Story = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollWrapper ref={wrapperRef}>
      <StyledTestContent>
        {[...Array(4)].map((i, index) => (
          <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
        ))}
      </StyledTestContent>
      <div>
        <StyledH2>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy{' '}
          <Tooltip parentNodeRef={wrapperRef}>Hello, Tooltip!</Tooltip>
        </StyledH2>
      </div>
      <StyledTestContent>
        {[...Array(6)].map((i, index) => (
          <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
        ))}
      </StyledTestContent>
    </ScrollWrapper>
  );
};

TooltipWrapperStory.storyName = 'Tooltip inside overflow scrolling wrapper';
