import { CategoryEntryPage } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { EntryFormWrapper } from '../../EntryForm/wrappers';
import { locationAccessibility } from '../../../config/accessibility';
import { useAccessibilityStructure } from '../../Accessibility/useAccessibilityStructure';

export const LocationAccessibilityPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { renderedForm } = useAccessibilityStructure(locationAccessibility, {});
  return (
    <>
      {renderedEntryHeader}
      <EntryFormWrapper>{renderedForm}</EntryFormWrapper>
    </>
  );
};
