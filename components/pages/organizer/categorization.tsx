import { ParsedUrlQuery } from 'node:querystring';
import React, { Reducer, useEffect, useMemo, useReducer } from 'react';
import { Category, CategoryEntryPage, useOrganizerTypeList } from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { CheckboxList } from '../../checkbox/CheckboxList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { PlaceholderField } from '../../placeholderfield';
import { Select } from '../../select';
import { Textarea } from '../../textarea';
import { EntryForm, FormGrid, FormItem, FormItemWidth, useEntryForm } from './helpers';

interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

enum SubjectsAction {
  update = 'update',
}

const subjectsReducer: Reducer<
  { [key: string]: string[] },
  { type: SubjectsAction; payload: { id: string; subjects: string[] } }
> = (state, action) => {
  switch (action.type) {
    case SubjectsAction.update: {
      return { ...state, [action.payload.id]: action.payload.subjects };
    }

    default: {
      break;
    }
  }
};

const ClassificationForm: React.FC<OrganizerFormProps> = ({
  category,
  query,
}: OrganizerFormProps) => {
  const t = useT();

  const { formState, setFormState, setPristine, formProps, formButtons } = useEntryForm(
    category,
    query
  );

  const organizerTypes = useOrganizerTypeList();

  const initialSubjects = useMemo(() => formState?.subjects?.map((subject) => String(subject)), [
    formState,
  ]);

  const organizerSubjects = useMemo(
    () =>
      formState?.type
        ? organizerTypes?.find((type) => String(type.id) === String(formState.type))?.relations
            ?.subjects
        : undefined,
    [formState, organizerTypes]
  );

  const [userSubjects, dispatchSubjects] = useReducer(
    subjectsReducer,
    initialSubjects && initialSubjects[formState?.type]
      ? { [formState.type]: initialSubjects }
      : undefined
  );

  useEffect(() => {
    if (formState?.type && initialSubjects) {
      if (!userSubjects) {
        dispatchSubjects({
          type: SubjectsAction.update,
          payload: { id: formState.type, subjects: initialSubjects },
        });
      }
    }
  }, [formState?.type, initialSubjects, userSubjects]);

  return (
    <EntryForm {...formProps}>
      <EntryFormHead
        title={t('categories.organizer.form.classification') as string}
        actions={formButtons}
      />
      <FormGrid>
        <FormItem width={FormItemWidth.half}>
          <Select
            label={t('categories.organizer.form.type') as string}
            id="ff1"
            value={String(formState?.type) || ''}
            onChange={(e) => {
              setPristine(false);
              setFormState({
                ...formState,
                type: String(e.target.value),
                subjects:
                  userSubjects && userSubjects[String(e.target.value)]
                    ? userSubjects[String(e.target.value)]
                    : [],
              });
            }}
            placeholder={t('general.choose') as string}
            required
          >
            {organizerTypes?.map((type, index) => (
              <option key={index} value={String(type.id)}>
                {type.attributes.name}
              </option>
            ))}
          </Select>
        </FormItem>
        <FormItem width={FormItemWidth.half}>
          {organizerSubjects ? (
            <CheckboxList
              label={t('categories.organizer.form.subjects') as string}
              checkboxes={
                organizerSubjects.map((subject) => ({
                  id: `ff-subject-select-${subject.id}`,
                  label: subject.attributes.name,
                  value: String(subject.id),
                })) || []
              }
              onChange={(val) => {
                setPristine(false);
                dispatchSubjects({
                  type: SubjectsAction.update,
                  payload: { id: formState.type, subjects: val },
                });
                setFormState({ ...formState, subjects: val });
              }}
              value={userSubjects && formState?.type ? userSubjects[formState.type] : []}
              required
            />
          ) : (
            <PlaceholderField
              label={`${t('categories.organizer.form.subjects')} (${t('forms.required')})`}
              text={t('categories.organizer.form.chooseTypeFirst') as string}
            />
          )}
        </FormItem>
        <FormItem width={FormItemWidth.full}>
          <Textarea
            id="ff-tags"
            label={`${t('categories.organizer.form.tags') as string} (TBD)`}
            rows={3}
            onChange={() => setPristine(false)}
          />
        </FormItem>
      </FormGrid>
    </EntryForm>
  );
};

export const OrganizerCategorizationPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  return (
    <EntryFormWrapper>
      <EntryFormContainer>
        <ClassificationForm category={category} query={query} />
      </EntryFormContainer>
    </EntryFormWrapper>
  );
};
