import { ApiCall } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { Save } from '../../EntryForm/Save';
import { EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useT } from '../../../lib/i18n';

export const OrganizerTeamPage: React.FC<CategoryEntryPage> = <
  T extends CategoryEntry,
  C extends ApiCall
>({
  category,
  query,
}: CategoryEntryPage) => {
  const t = useT();
  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.team') as string,
    true,
    true
  );
  const { entry } = useEntry<T, C>(category, query);
  const formattedDate = useSaveDate(entry);

  return (
    <>
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            // submit();
          }}
          active={false}
          date={formattedDate}
          valid={true}
          hint={false}
        />
        <EntryFormWrapper></EntryFormWrapper>
      </div>
    </>
  );
};
