import { ParsedUrlQuery } from 'node:querystring';
import React, { useEffect, useMemo, useState } from 'react';
import { useApiCall } from '../../../lib/api';
import { OrganizerShow } from '../../../lib/api/routes/organizer/show';
import { OrganizerUpdate } from '../../../lib/api/routes/organizer/update';
import { Organizer } from '../../../lib/api/types/organizer';
import {
  Category,
  CategoryEntryPage,
  useMutateList,
  useEntry,
  useOrganizerTypeList,
} from '../../../lib/categories';
import { useT } from '../../../lib/i18n';
import { Button, ButtonColor } from '../../button';
import { EntryFormHead } from '../../EntryForm/EntryFormHead';
import { EntryFormContainer, EntryFormWrapper } from '../../EntryForm/wrappers';
import { TypesSubjects } from '../../TypesSubjects';
import { FormGrid, FormItem, FormItemWidth } from '../helpers/formComponents';
import { useEntryHeader } from '../helpers/useEntryHeader';

interface EntryFormProps {
  category: Category;
  query: ParsedUrlQuery;
}

const ClassificationForm: React.FC<EntryFormProps> = ({ category, query }: EntryFormProps) => {
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
    return types && types.length > 0;
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
            }}
            icon="CheckSquare"
            color={ButtonColor.green}
            disabled={!valid || pristine}
          >
            {t('categories.organizer.form.save')}
          </Button>,
        ]}
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
  );
};

export const OrganizerCategorizationPage: React.FC<CategoryEntryPage> = ({
  category,
  query,
}: CategoryEntryPage) => {
  const renderedEntryHeader = useEntryHeader({ category, query });

  return (
    <>
      {renderedEntryHeader}
      <EntryFormWrapper>
        <EntryFormContainer>
          <ClassificationForm category={category} query={query} />
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  );
};
