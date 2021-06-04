import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React, { useContext } from 'react';
import { useOverlay } from '.';
import { Button } from '../button';
import { NavigationContext } from '../navigation/NavigationContext';
import { OverlayTitleBar } from './OverlayTitleBar';

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

interface OverlayExampleProps {
  renderTitlebar?: boolean;
  stickyTitlebar?: boolean;
}
const OverlayExample: React.FC<OverlayExampleProps> = ({
  renderTitlebar,
  stickyTitlebar,
}: OverlayExampleProps) => {
  const { renderedOverlay, setIsOpen } = useOverlay(
    <div>
      {renderTitlebar && (
        <OverlayTitleBar
          title="Test Overlay"
          actions={[<Button key={1}>Mock button</Button>, <Button key={2}>Mock button</Button>]}
          sticky={stickyTitlebar}
        />
      )}
      <StyledTestContent>
        {[...Array(10)].map((i, index) => (
          <StyledTestContentBox key={index}>Test Content</StyledTestContentBox>
        ))}
      </StyledTestContent>
    </div>,
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

export const OverlayDefaultStory: Story = () => <OverlayExample renderTitlebar stickyTitlebar />;
OverlayDefaultStory.storyName = 'Overlay with sticky TitleBar';

export const OverlayNonStickyTitlebarStory: Story = () => <OverlayExample renderTitlebar />;
OverlayNonStickyTitlebarStory.storyName = 'Overlay with non sticky TitleBar';

export const OverlayNoTitlebarStory: Story = () => <OverlayExample />;
OverlayNoTitlebarStory.storyName = 'Overlay without TitleBar';
