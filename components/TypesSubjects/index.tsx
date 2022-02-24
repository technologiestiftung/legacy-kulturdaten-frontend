import styled from '@emotion/styled';
import { Reducer, useEffect, useReducer, useState } from 'react';
import {
  OrganizerSubjectTranslation,
  OrganizerType,
  OrganizerTypeTranslation,
} from '../../lib/api/types/organizer';
import { useT } from '../../lib/i18n';
import { useLanguage } from '../../lib/routing';
import { sortByTranslation } from '../../lib/sortTranslations';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Checkbox } from '../checkbox';
import { CheckboxList } from '../checkbox/CheckboxList';
import { ComponentLoader } from '../ComponentLoader';

const StyledTypesSubjects = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
  position: relative;
`;

const StyledTypesSubjectsType = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  overflow: hidden;
`;

const StyledTypesSubjectsTypeHead = styled.div`
  padding: 0.75rem;
  position: relative;
`;

const StyledTypesSubjectsSubjects = styled.div`
  padding: 0.75rem 0.75rem 1.125rem;
  background: var(--grey-200);
`;

enum TypesSubjectsActions {
  addType = 'addType',
  deleteType = 'deleteType',
  updateSubjects = 'updateSubjecs',
  init = 'init',
}

type TypesSubjectsState = { types: string[]; subjects: string[] };

type TypesSubjectsAction = {
  type: TypesSubjectsActions;
  payload: {
    state?: TypesSubjectsState;
    type?: string;
    subjects?: string[];
  };
};

const typesSubjectsReducer: Reducer<TypesSubjectsState, TypesSubjectsAction> = (state, action) => {
  switch (action.type) {
    case TypesSubjectsActions.addType: {
      if (!state.types.includes(action.payload.type)) {
        return { ...state, types: state.types.concat([action.payload.type]) };
      }
      return state;
    }

    case TypesSubjectsActions.deleteType: {
      const updatedTypes = [...state.types].filter((type) => type !== action.payload.type);
      return { ...state, types: updatedTypes };
    }

    case TypesSubjectsActions.updateSubjects: {
      return { ...state, subjects: action.payload.subjects };
    }

    case TypesSubjectsActions.init: {
      return action.payload.state;
    }
    default: {
      break;
    }
  }
};

interface TypesSubjectsProps {
  options: OrganizerType[];
  value?: TypesSubjectsState;
  onChange?: (value: TypesSubjectsState) => void;
  pristine?: boolean;
  setPristine?: (pristine: boolean) => void;
  required?: boolean;
  valid?: boolean;
}

export const TypesSubjects: React.FC<TypesSubjectsProps> = ({
  options,
  value,
  onChange,
  pristine,
  setPristine,
  required = false,
  valid = true,
}: TypesSubjectsProps) => {
  const pseudoUid = usePseudoUID();
  const [intPristine, intSetPristine] = useState(true);
  const pristineState = typeof pristine !== 'undefined' ? pristine : intPristine;
  const setPristineState = setPristine || intSetPristine;
  const t = useT();
  const language = useLanguage();

  const [state, dispatch] = useReducer(typesSubjectsReducer, {
    types: value?.types?.map((type) => type),
    subjects: value?.subjects?.map((subject) => subject),
  });

  useEffect(() => {
    if (pristineState && value && (value.subjects?.length > 0 || value.types?.length > 0)) {
      dispatch({
        type: TypesSubjectsActions.init,
        payload: {
          state: {
            types: value?.types?.map((type) => type),
            subjects: value?.subjects?.map((subject) => subject),
          },
        },
      });
      setPristineState(false);
    }
  }, [pristineState, setPristineState, value]);

  useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  });

  return (
    <StyledTypesSubjects aria-required={required} aria-invalid={!valid} role="listbox">
      {options?.map((type, index) => {
        const typeTranslation = getTranslation<OrganizerTypeTranslation>(
          language,
          type.relations?.translations
        );

        const typeIsChecked = state.types?.includes(String(type?.id));

        const hasSubjects =
          Array.isArray(type?.relations?.subjects) && type?.relations?.subjects.length > 0;

        return (
          <StyledTypesSubjectsType key={index}>
            <StyledTypesSubjectsTypeHead>
              <Checkbox
                id={`${pseudoUid}-type-${type?.id}`}
                value={String(type?.id)}
                checked={typeIsChecked}
                label={typeTranslation?.attributes?.name}
                onChange={(e) => {
                  dispatch({
                    type: e.target.checked
                      ? TypesSubjectsActions.addType
                      : TypesSubjectsActions.deleteType,
                    payload: { type: String(type.id) },
                  });
                  setPristineState(false);
                }}
              />
            </StyledTypesSubjectsTypeHead>
            {hasSubjects && typeIsChecked && (
              <StyledTypesSubjectsSubjects>
                <CheckboxList
                  columns={3}
                  value={state.subjects}
                  label={t('forms.subjects') as string}
                  onChange={(value) => {
                    setPristineState(false);
                    dispatch({
                      type: TypesSubjectsActions.updateSubjects,
                      payload: { subjects: value },
                    });
                  }}
                  checkboxes={
                    type?.relations?.subjects
                      ? sortByTranslation(type?.relations?.subjects, language)?.map((subject) => {
                          const subjectTranslation = getTranslation<OrganizerSubjectTranslation>(
                            language,
                            subject.relations?.translations
                          );

                          return {
                            id: `${pseudoUid}-type-${type.id}-subject-${subject.id}`,
                            value: String(subject.id),
                            label: subjectTranslation?.attributes?.name,
                            checked: state.subjects?.includes(String(subject.id)),
                          };
                        })
                      : undefined
                  }
                />
              </StyledTypesSubjectsSubjects>
            )}
          </StyledTypesSubjectsType>
        );
      }) || <ComponentLoader />}
    </StyledTypesSubjects>
  );
};
