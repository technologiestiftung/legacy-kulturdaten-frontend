import { ParsedUrlQuery } from 'node:querystring';
import React, { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { Organizer } from '../../../lib/api/types/organizer';
import {
  Category,
  CategoryEntryPage,
  useEntry,
  useOrganizerTypeList,
} from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useLanguage } from '../../../lib/routing';
import { getTranslation } from '../../../lib/translations';
import { CheckboxList } from '../../checkbox/CheckboxList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { PlaceholderField } from '../../placeholderfield';
import { Select } from '../../select';
import { Textarea } from '../../textarea';
import { FormGrid, FormItem, FormItemWidth } from './helpers';

interface OrganizerFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

enum SubjectsAction {
  update = 'update',
}

const subjectsReducer: Reducer<
  { [key: string]: number[] },
  { type: SubjectsAction; payload: { id: number; subjects: number[] } }
> = (state, action) => {
  switch (action.type) {
    case SubjectsAction.update: {
      return { ...state, [String(action.payload.id)]: action.payload.subjects };
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
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const [types, setTypes] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<number[]>([]);
  const [pristine, setPristine] = useState(true);

  const typeOptions = useOrganizerTypeList();

  const t = useT();
  const language = useLanguage();

  const initialSubjects = useMemo(
    () => entry?.data?.relations?.subjects?.map((subject) => subject.id),
    [entry?.data?.relations?.subjects]
  );

  const initialTypes = useMemo(() => entry?.data?.relations?.types?.map((type) => type.id), [
    entry?.data?.relations?.types,
  ]);

  useEffect(() => {
    if (pristine) {
      setTypes(initialTypes);
    }
  }, [pristine, initialTypes]);

  useEffect(() => {
    if (pristine) {
      setSubjects(initialSubjects);
    }
  }, [pristine, initialSubjects]);

  // const organizerSubjects = useMemo(
  //   () =>
  //     formState?.relations?.types
  //       ? organizerTypes?.find((type) => type.id === formState?.relations?.types[0])?.relations
  //           ?.subjects
  //       : undefined,
  //   [formState, organizerTypes]
  // );

  // const [userSubjects, dispatchSubjects] = useReducer(
  //   subjectsReducer,
  //   formState?.relations?.types &&
  //     initialSubjects &&
  //     initialSubjects[String(formState?.relations?.types[0])]
  //     ? { [String(formState?.relations?.types[0])]: initialSubjects }
  //     : undefined
  // );

  // useEffect(() => {
  //   if (formState?.relations?.types && formState?.relations?.types[0] && initialSubjects) {
  //     if (!userSubjects) {
  //       dispatchSubjects({
  //         type: SubjectsAction.update,
  //         payload: { id: formState.relations.types[0], subjects: initialSubjects },
  //       });
  //     }
  //   }
  // }, [formState?.relations?.types, initialSubjects, userSubjects]);

  return (
    <div>
      <EntryFormHead title={t('categories.organizer.form.classification') as string} />
      <div>
        {typeOptions?.map((type, typeIndex) => {
          // const typeTranslation = getTranslation(language, type.relations?.translations);
          const typeTranslation = type.relations?.translations
            ? type.relations?.translations[0]
            : undefined;
          return (
            <div key={typeIndex}>
              <div>
                [{types.includes(type.id) ? 'X' : ' '}] {typeTranslation?.attributes?.name}
              </div>
              <div>
                {type.relations?.subjects?.map((subject, subjectIndex) => {
                  // const subjectTranslation = getTranslation(language, subject.relations?.translations);
                  const subjectTranslation = subject.relations?.translations
                    ? subject.relations?.translations[0]
                    : undefined;
                  return (
                    <div key={subjectIndex}>
                      <div>
                        — [{subjects.includes(subject.id) ? 'X' : ' '}]{' '}
                        {subjectTranslation?.attributes?.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
