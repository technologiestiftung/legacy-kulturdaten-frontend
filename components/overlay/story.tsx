import { Story } from '@storybook/react';
import React, { useContext } from 'react';
import { useOverlay } from '.';
import { Button } from '../button';
import { NavigationContext } from '../navigation/NavigationContext';

export default {
  title: 'Overlay',
};

const X: React.FC = () => {
  const { renderedOverlay, isOpen, setIsOpen } = useOverlay(<div>Overlay Content</div>, true);
  const { overlayOpen } = useContext(NavigationContext);

  return (
    <div>
      <Button
        onClick={() => {
          console.log('click');
          console.log(isOpen);
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
