import React, { useContext, useEffect, useMemo, useState } from 'react';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { Organizer } from '../../../lib/api/types/organizer';
import { CategoryEntryPage, useEntry } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { useEntryTypeSubjectForm } from '../helpers/form/TypeSubject';
import { useEntryTags } from '../helpers/form/Tags';

export const OrganizerCategorizationPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const t = useT();
  const renderedEntryHeader = useEntryHeader(
    { category, query },
    t('menu.start.items.profile') as string,
    true
  );
  const [loaded, setLoaded] = useState(false);
  const { rendered } = useContext(WindowContext);

  useEffect(() => {
    if (rendered && typeof entry !== 'undefined') {
      setTimeout(() => setLoaded(true), 150);
    }

    return () => {
      setLoaded(false);
    };
  }, [rendered, entry]);

  const {
    renderedForm,
    submit,
    pristine: pristineClassification,
    reset,
    valid,
  } = useEntryTypeSubjectForm({ category, query }, loaded, false);

  const {
    renderedForm: renderedTagsForm,
    submit: submitTags,
    pristine: pristineTags,
  } = useEntryTags(
    { category, query },
    loaded,
    valid,
    false,
    t('categories.organizer.form.topicsTooltip')
  );

  const shouldWarn = useMemo(() => !pristineClassification && typeof entry?.data !== 'undefined', [
    pristineClassification,
    entry?.data,
  ]);

  useConfirmExit(shouldWarn, t('save.confirmExit') as string, () => reset());

  return (
    <>
      {renderedEntryHeader}
      <div role="form">
        <Save
          onClick={async () => {
            if (!pristineClassification) {
              submit();
            }
            if (!pristineTags) {
              submitTags();
            }
          }}
          active={!pristineTags || !pristineClassification}
          date={formattedDate}
          valid={loaded !== true || valid}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{renderedForm}</EntryFormContainer>
          <EntryFormContainer>{renderedTagsForm}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
