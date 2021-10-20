import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { locationAccessibility } from '../../config/accessibility';
import { useAccessibilityStructure } from './useAccessibilityStructure';

export default {
  title: 'Accessibility',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const EmbeddedAccessibilityLocationStory: React.FC = () => {
  const { renderedForm } = useAccessibilityStructure(locationAccessibility, {
    'planning.entry.stairs': true,
  });

  return <StyledTestWrapper>{renderedForm}</StyledTestWrapper>;
};

export const AccessibilityLocationStory: Story = () => <EmbeddedAccessibilityLocationStory />;
