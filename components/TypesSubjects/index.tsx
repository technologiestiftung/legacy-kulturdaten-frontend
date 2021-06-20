import styled from '@emotion/styled';
import { Reducer, useEffect, useReducer, useState } from 'react';
import { OrganizerType } from '../../lib/api/types/organizer';
import { useT } from '../../lib/i18n';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { Checkbox } from '../checkbox';
import { CheckboxList } from '../checkbox/CheckboxList';

const StyledTypesSubjects = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 0.75rem;
`;

const StyledTypesSubjectsType = styled.div`
  display: flex;
  flex-direction: column;

  background: var(--white);
  border: 1px solid var(--grey-400);
  border-radius: 0.75rem;
  overflow: hidden;
`;
const StyledTypesSubjectsTypeHead = styled.div`
  padding: 0.75rem;
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
}

export const TypesSubjects: React.FC<TypesSubjectsProps> = ({
  options,
  value,
  onChange,
  pristine,
  setPristine,
}: TypesSubjectsProps) => {
  const pseudoUid = usePseudoUID();
  const [intPristine, intSetPristine] = useState(true);
  const pristineState = typeof pristine !== 'undefined' ? pristine : intPristine;
  const setPristineState = setPristine || intSetPristine;
  const t = useT();

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
    <StyledTypesSubjects>
      {options?.map((type, index) => {
        // const typeTranslation = getTranslation(language, type.relations?.translations);
        const typeTranslation = type.relations?.translations
          ? type.relations?.translations[0]
          : undefined;

        const typeIsChecked = state.types?.includes(String(type?.id));

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
            {typeIsChecked && (
              <StyledTypesSubjectsSubjects>
                <CheckboxList
                  columns={3}
                  value={state.subjects}
                  label={t('categories.organizer.form.subjects') as string}
                  onChange={(value) => {
                    setPristineState(false);
                    dispatch({
                      type: TypesSubjectsActions.updateSubjects,
                      payload: { subjects: value },
                    });
                  }}
                  checkboxes={type?.relations?.subjects?.map((subject) => {
                    // const subjectTranslation = getTranslation(language, subject.relations?.translations);
                    const subjectTranslation = subject.relations?.translations
                      ? subject.relations?.translations[0]
                      : undefined;

                    return {
                      id: `${pseudoUid}-type-${type.id}-subject-${subject.id}`,
                      value: String(subject.id),
                      label: subjectTranslation?.attributes?.name,
                      checked: state.subjects?.includes(String(subject.id)),
                    };
                  })}
                />
              </StyledTypesSubjectsSubjects>
            )}
          </StyledTypesSubjectsType>
        );
      })}
    </StyledTypesSubjects>
  );
};
