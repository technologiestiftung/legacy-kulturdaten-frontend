import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React, { useContext } from 'react';
import { useOverlay } from '.';
import { Button } from '../button';
import { NavigationContext } from '../navigation/NavigationContext';

export default {
  title: 'Overlay',
};

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

const X: React.FC = () => {
  const { renderedOverlay, setIsOpen } = useOverlay(
    <StyledTestContent>
      {[...Array(10)].map((i, index) => (
        <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
      ))}
    </StyledTestContent>,
    true
  );
  const { overlayOpen } = useContext(NavigationContext);

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Overlay öffnen
      </Button>
      <span>Overlay open: {overlayOpen.toString()}</span>
      {renderedOverlay}
    </div>
  );
};

export const OverlayDefaultStory: Story = () => <X />;
