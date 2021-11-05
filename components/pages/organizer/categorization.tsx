import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { usePublish } from '../../Publish';

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
    renderedForm: formTypeSubject,
    submit: submitTypeSubject,
    pristine: pristineTypeSubject,
    reset: resetTypeSubject,
    valid: validTypeSubject,
    requirementFulfillment: requiredFulfillmentTypeSubject,
  } = useEntryTypeSubjectForm({ category, query, loaded, required: true });

  const {
    renderedForm: formTags,
    submit: submitTags,
    pristine: pristineTags,
    reset: resetTags,
    valid: validTags,
  } = useEntryTags({
    category,
    query,
    loaded,
    tooltip: t('categories.organizer.form.topicsTooltip'),
  });

  const shouldWarn = useMemo(
    () => !pristineTypeSubject && typeof entry?.data !== 'undefined',
    [pristineTypeSubject, entry?.data]
  );

  useConfirmExit(shouldWarn, t('save.confirmExit') as string, () => {
    resetTypeSubject();
    resetTags();
  });

  const valid = useMemo(() => validTypeSubject && validTags, [validTypeSubject, validTags]);

  const pristine = useMemo(
    () => ![pristineTypeSubject, pristineTags].includes(false),
    [pristineTypeSubject, pristineTags]
  );

  const formRequirementFulfillments = useMemo(
    () => [requiredFulfillmentTypeSubject],
    [requiredFulfillmentTypeSubject]
  );

  const onSave = useCallback(async () => {
    if (!pristineTypeSubject) {
      submitTypeSubject();
    }
    if (!pristineTags) {
      submitTags();
    }
  }, [pristineTypeSubject, pristineTags, submitTypeSubject, submitTags]);

  const { renderedPublish } = usePublish({
    category,
    query,
    formRequirementFulfillments,
    onPublish: onSave,
  });

  return (
    <>
      {renderedPublish}
      {renderedEntryHeader}
      <div role="form">
        <Save
          onClick={onSave}
          active={!pristine}
          date={formattedDate}
          valid={loaded !== true || valid}
        />
        <EntryFormWrapper>
          <EntryFormContainer>{formTypeSubject}</EntryFormContainer>
          <EntryFormContainer>{formTags}</EntryFormContainer>
        </EntryFormWrapper>
      </div>
    </>
  );
};
