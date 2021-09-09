import { CategoryEntryPage } from '../../../lib/categories';
import { useEntryHeader } from '../helpers/useEntryHeader';

export const OfferAccessibilityPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  return (
    <>
      {renderedEntryHeader}
      <div>TBD</div>
    </>
  );
};