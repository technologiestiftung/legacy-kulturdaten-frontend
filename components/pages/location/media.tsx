import { useContext, useEffect, useMemo, useState } from 'react';
import { ApiCall } from '../../../lib/api';
import { CategoryEntry } from '../../../lib/api/types/general';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useMediaForm } from '../helpers/media';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { usePublish } from '../../Publish';

export const LocationMediaPage: React.FC<CategoryEntryPage> = <
  T extends CategoryEntry,
  C extends ApiCall
>({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });
  const { entry } = useEntry<T, C>(category, query);
  const formattedDate = useSaveDate(entry);
  const { rendered } = useContext(WindowContext);
  const [loaded, setLoaded] = useState(false);
  const t = useT();

  const { renderedForm, submit, pristine, valid, reset } = useMediaForm({
    category,
    query,
    loaded,
  });

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const message = t('save.confirmExit') as string;

  const shouldWarn = useMemo(
    () => !pristine && typeof entry?.data !== 'undefined',
    [pristine, entry?.data]
  );

  useConfirmExit(shouldWarn, message, () => {
    reset();
  });

  const { renderedPublish } = usePublish({
    category,
    query,
    onPublish: async () => console.log('publish'),
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div>
        <Save
          onClick={async () => {
            submit();
          }}
          active={!pristine}
          date={formattedDate}
          valid={valid}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{renderedForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
