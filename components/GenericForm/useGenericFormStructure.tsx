import { Dispatch, Reducer, useReducer } from 'react';
import { GenericFormCategory, GenericFormFieldValue } from '../../lib/genericForm';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { EntryFormContainer } from '../EntryForm/wrappers';
import { GenericFormCategoryFactory } from './GenericFormCategoryFactory';

export interface GenericFormStateConsumer {
  state: GenericFormState;
  dispatch: Dispatch<GenericFormAction>;
}

export enum GenericFormActions {
  init = 'init',
  set = 'set',
}

export type GenericFormState = { [key: string]: GenericFormFieldValue };

export type GenericFormAction = {
  type: GenericFormActions;
  payload?: {
    state?: GenericFormState;
    key?: string;
    value?: GenericFormFieldValue;
  };
};

export const genericFormActionInit = (state: GenericFormState): GenericFormAction => ({
  type: GenericFormActions.init,
  payload: {
    state,
  },
});

export const genericFormActionSet = (
  key: string,
  value: string | string[] | boolean
): GenericFormAction => ({
  type: GenericFormActions.set,
  payload: {
    key,
    value,
  },
});

const genericFormReducer: Reducer<GenericFormState, GenericFormAction> = (state, action) => {
  switch (action.type) {
    case GenericFormActions.init: {
      return action.payload.state;
    }

    case GenericFormActions.set: {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    }

    default: {
      break;
    }
  }
};

export const useGenericFormStructure = (
  structure: GenericFormCategory[],
  initialState?: GenericFormState
): {
  renderedForm: React.ReactElement;
  state: GenericFormState;
  dispatch: Dispatch<GenericFormAction>;
} => {
  const language = useLanguage();

  const [state, dispatch] = useReducer(genericFormReducer, initialState || {});

  const renderedElements = structure?.map((category, index) => {
    const currentTranslation = getTranslation(language, category.translations, true);
    return (
      <EntryFormContainer key={index}>
        <GenericFormCategoryFactory
          title={currentTranslation?.attributes?.name}
          fieldGroups={category.children}
          state={state}
          dispatch={dispatch}
        />
      </EntryFormContainer>
    );
  });

  return {
    renderedForm: <>{renderedElements}</>,
    state,
    dispatch,
  };
};
