import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { locationAccessibility } from '../../config/accessibility';
import { EntryFormWrapper } from '../EntryForm/wrappers';
import { useGenericFormStructure } from './useGenericFormStructure';

export default {
  title: 'Generic Form',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const EmbeddedGenericFormLocationStory: React.FC = () => {
  const { renderedForm } = useGenericFormStructure(locationAccessibility, {
    'planning.entry.stairs': true,
  });

  return (
    <StyledTestWrapper>
      <EntryFormWrapper>{renderedForm}</EntryFormWrapper>
    </StyledTestWrapper>
  );
};

export const GenericFormAccessibilityLocationStory: Story = () => (
  <EmbeddedGenericFormLocationStory />
);
GenericFormAccessibilityLocationStory.storyName = 'Accessibility Location';
