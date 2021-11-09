import React, { useEffect, useMemo, useState } from 'react';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { useEntry, useEntryTypeList } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { TypesSubjects } from '../../../TypesSubjects';
import { FormGrid, FormItem, FormItemWidth, FormWrapper } from '../formComponents';
import { EntryFormHook } from '../form';
import { CategoryEntry } from '../../../../lib/api/types/general';

export const useEntryTypeSubjectForm: EntryFormHook = ({
  category,
  query,
  loaded,
  title,
  required,
  id,
}) => {
  const { entry, mutate } = useEntry<CategoryEntry, ApiCall>(category, query);
  const t = useT();
  const call = useApiCall();
  const [types, setTypes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [typesSubjectsPristine, setTypesSubjectsPristine] = useState(true);

  const typeOptions = useEntryTypeList(
    category.api.typeList?.route,
    category.api.typeList?.factory
  );

  const validTypeOptions = useMemo(
    () => typeOptions?.filter((type) => types?.includes(String(type.id))),
    [typeOptions, types]
  );

  const validSubjectOptions = useMemo(
    () =>
      validTypeOptions?.reduce((combinedSubjects, typeOption) => {
        return combinedSubjects?.concat(
          typeOption?.relations?.subjects?.map((subjectOption) => subjectOption.id)
        );
      }, []),
    [validTypeOptions]
  );

  const filteredSubjects = useMemo(
    () =>
      subjects?.filter((subject) => {
        return validSubjectOptions?.includes(parseInt(subject, 10));
      }),
    [validSubjectOptions, subjects]
  );

  // Valid if one or more types are defined
  const valid = useMemo(() => {
    return !required || !loaded || (types && types.length > 0);
  }, [required, loaded, types]);

  const fulfilled = useMemo(() => {
    return (types && typeof types !== 'undefined' && types.length > 0) || undefined;
  }, [types]);

  const initialSubjects = useMemo(
    () => entry?.data?.relations?.subjects?.map((subject) => String(subject.id)),
    [entry?.data?.relations?.subjects]
  );

  const initialTypes = useMemo(
    () => entry?.data?.relations?.types?.map((type) => String(type.id)),
    [entry?.data?.relations?.types]
  );

  const pristine = useMemo(() => {
    const sortedInitialSubjects = initialSubjects ? [...initialSubjects].sort() : undefined;
    const sortedCurrentSubjects = filteredSubjects ? [...filteredSubjects].sort() : undefined;

    const subjectsEqual =
      sortedInitialSubjects?.length === sortedCurrentSubjects?.length &&
      sortedInitialSubjects?.reduce((equal, subject, index) => {
        if (subject !== sortedCurrentSubjects[index]) {
          return false;
        }

        return equal;
      }, true);

    const sortedInitialTypes = initialTypes ? [...initialTypes].sort() : undefined;
    const sortedCurrentTypes = types ? [...types].sort() : undefined;

    const typesEqual =
      sortedInitialTypes?.length === sortedCurrentTypes?.length &&
      sortedInitialTypes?.reduce((equal, subject, index) => {
        if (subject !== sortedCurrentTypes[index]) {
          return false;
        }

        return equal;
      }, true);

    return subjectsEqual && typesEqual;
  }, [initialSubjects, initialTypes, filteredSubjects, types]);

  useEffect(() => {
    if (typesSubjectsPristine) {
      setTypes(initialTypes);
    }
  }, [typesSubjectsPristine, initialTypes]);

  useEffect(() => {
    if (typesSubjectsPristine) {
      setSubjects(initialSubjects);
    }
  }, [typesSubjectsPristine, initialSubjects]);

  return {
    renderedForm: (
      <FormWrapper requirement={{ fulfilled }}>
        <EntryFormHead title={title || `${t('forms.classification') as string}`} id={id} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            <TypesSubjects
              options={typeOptions}
              value={{ types, subjects }}
              onChange={({ types, subjects }) => {
                setTypes(types);
                setSubjects(subjects);
              }}
              pristine={typesSubjectsPristine}
              setPristine={setTypesSubjectsPristine}
              required
            />
          </FormItem>
        </FormGrid>
      </FormWrapper>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const validTypeOptions = typeOptions.filter((type) => types.includes(String(type.id)));

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

          const resp = await call(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                types: types.map((type) => parseInt(type, 10)),
                subjects: subs.map((subject) => parseInt(subject, 10)),
              },
            },
          });

          if (resp.status === 200) {
            mutate();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setTypes(initialTypes);
      setSubjects(initialSubjects);
      setTypesSubjectsPristine(true);
    },
    valid,
    requirementFulfillment: {
      requirementKey: 'types',
      fulfilled,
    },
  };
};
