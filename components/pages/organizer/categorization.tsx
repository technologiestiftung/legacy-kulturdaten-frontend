import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import {
  CategoryEntryPage,
  useMutateList,
  useEntry,
  useOrganizerTypeList,
} from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { useConfirmExit } from '../../../lib/useConfirmExit';
import { WindowContext } from '../../../lib/WindowService';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { Save } from '../../EntryForm/Save';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { TypesSubjects } from '../../TypesSubjects';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';
import { useSaveDate } from '../helpers/useSaveDate';
import { EntryFormHook } from './info';

const useClassificationForm: EntryFormHook = ({ category, query }, loaded) => {
  const { entry, mutate } = useEntry<Organizer, OrganizerShow>(category, query);
  const t = useT();
  const call = useApiCall();
  const [types, setTypes] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [typesSubjectsPristine, setTypesSubjectsPristine] = useState(true);
  const mutateList = useMutateList(category);

  const typeOptions = useOrganizerTypeList();

  const validTypeOptions = useMemo(
    () => typeOptions?.filter((type) => types.includes(String(type.id))),
    [typeOptions, types]
  );

  const validSubjectOptions = useMemo(
    () =>
      validTypeOptions?.reduce((combinedSubjects, typeOption) => {
        return combinedSubjects.concat(
          typeOption.relations.subjects.map((subjectOption) => subjectOption.id)
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

  // Valid if types and subjects are defined
  const valid = useMemo(() => {
    return !loaded || (types && types.length > 0);
  }, [loaded, types]);

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
      <div>
        <EntryFormHead
          title={t('categories.organizer.form.classification') as string}
          valid={!loaded || valid}
        />
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
            />
          </FormItem>
        </FormGrid>
      </div>
    ),
    submit: async () => {
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

        const resp = await call<OrganizerUpdate>(category.api.update.factory, {
          id: entry.data.id,
          organizer: {
            relations: {
              types: types.map((type) => parseInt(type, 10)),
              subjects: subs.map((subject) => parseInt(subject, 10)),
              address: entry.data.relations.address,
            },
          },
        });

        if (resp.status === 200) {
          mutate();
          mutateList();
        }
      } catch (e) {
        console.error(e);
      }
    },
    pristine,
    reset: () => {
      setTypes(initialTypes);
      setSubjects(initialSubjects);
      setTypesSubjectsPristine(true);
    },
    valid,
    hint: false,
  };
};

export const OrganizerCategorizationPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const { entry } = useEntry<Organizer, OrganizerShow>(category, query);
  const formattedDate = useSaveDate(entry);
  const renderedEntryHeader = useEntryHeader({ category, query });
  const t = useT();
  // const loaded = useMemo(() => typeof entry !== 'undefined', [entry]);

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

  const { renderedForm, submit, pristine, reset, valid } = useClassificationForm(
    { category, query },
    loaded
  );

  useConfirmExit(!pristine, t('save.confirmExit') as string, () => reset());

  return (
    <>
      {renderedEntryHeader}
      <Save
        onClick={async () => {
          submit();
        }}
        active={!pristine}
        date={formattedDate}
        valid={loaded !== true || valid}
      />
      <EntryFormWrapper>
        <EntryFormContainer>{renderedForm}</EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
