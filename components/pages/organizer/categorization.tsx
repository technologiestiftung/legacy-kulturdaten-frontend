import { ParsedUrlQuery } from 'node:querystring';
import React, { Reducer, useEffect, useMemo, useReducer, useState } from 'react';
import { mutate as mutateSwr } from 'swr';
import { getApiUrlString, useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
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
import { Button, ButtonColor, ButtonType } from '../../button';
import { CheckboxList } from '../../checkbox/CheckboxList';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { PlaceholderField } from '../../placeholderfield';
import { Select } from '../../select';
import { Textarea } from '../../textarea';
import { TypesSubjects } from '../../TypesSubjects';
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
  const [types, setTypes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [pristine, setPristine] = useState(true);
  const [typesSubjectsPristine, setTypesSubjectsPristine] = useState(true);

  const typeOptions = useOrganizerTypeList();

  const t = useT();
  const language = useLanguage();

  const initialSubjects = useMemo(
    () => entry?.data?.relations?.subjects?.map((subject) => String(subject.id)),
    [entry?.data?.relations?.subjects]
  );

  const initialTypes = useMemo(
    () => entry?.data?.relations?.types?.map((type) => String(type.id)),
    [entry?.data?.relations?.types]
  );

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

  const call = useApiCall();
  return (
    <div>
      <EntryFormHead
        title={t('categories.organizer.form.classification') as string}
        actions={[
          <Button
            key={0}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setTypes(initialTypes);
              setSubjects(initialSubjects);
              setPristine(true);
              setTypesSubjectsPristine(true);
            }}
            icon="XOctagon"
            color={ButtonColor.yellow}
            disabled={pristine}
          >
            {t('categories.organizer.form.editCancel')}
          </Button>,
          <Button
            key={1}
            onClick={async (e) => {
              e.preventDefault();

              try {
                const validTypeOptions = typeOptions.filter((type) =>
                  types.includes(String(type.id))
                );
                console.log(validTypeOptions);

                const subs = subjects.filter((subject) => {
                  for (let i = 0; i < validTypeOptions.length; i += 1) {
                    const validSubjects = validTypeOptions[i].relations.subjects.map(
                      (subject) => subject.id
                    );
                    if (validSubjects.includes(parseInt(subject, 10))) {
                      return true;
                    }
                  }

                  return false;
                });

                console.log({ subs });

                const resp = await call<OrganizerUpdate>(category.api.update.factory, {
                  id: entry.data.id,
                  organizer: {
                    relations: {
                      types: types,
                      subjects: subs,
                    },
                  },
                });

                if (resp.status === 200) {
                  mutate();
                  mutateSwr(getApiUrlString(category.api.list.route));
                  setTimeout(() => setPristine(true), 500);
                }
              } catch (e) {
                console.error(e);
              }
            }}
            icon="CheckSquare"
            color={ButtonColor.green}
            disabled={pristine}
          >
            {t('categories.organizer.form.save')}
          </Button>,
        ]}
      />
      {/* <div>
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
      </div> */}
      <FormGrid>
        <FormItem width={FormItemWidth.full}>
          <TypesSubjects
            options={typeOptions}
            value={{ types, subjects }}
            onChange={({ types, subjects }) => {
              setTypes(types);
              setSubjects(subjects);
              // setPristine(false);
            }}
            pristine={pristine}
            setPristine={setPristine}
          />
        </FormItem>
      </FormGrid>
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
