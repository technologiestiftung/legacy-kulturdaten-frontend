import { CategoryEntryPage, useEntry, useTabs } from '../../../lib/categories';
import { TitleBar } from '../../navigation/TitleBar';
import { AppWrapper } from '../../wrappers/AppWrapper';

export const OrganizerInfoPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const entry = useEntry(category, query);
  const tabs = useTabs(category);

  return (
    <AppWrapper titleBar={<TitleBar title={entry?.attributes.name} />}>
      {tabs}
      Update this
    </AppWrapper>
  );
};
