import { Dispatch, Reducer, useReducer } from 'react';
import { AccessibilityCategory } from '../../lib/accessibility';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { AccessibilityCategoryFactory } from './AccessibilityCategoryFactory';

export interface A11yStateConsumer {
  state: A11yState;
  dispatch: Dispatch<A11yAction>;
}

export enum A11yActions {
  init = 'init',
  set = 'set',
}

export type A11yState = { [key: string]: string | string[] | boolean };

export type A11yAction = {
  type: A11yActions;
  payload?: {
    state?: A11yState;
    key?: string;
    value?: string | string[] | boolean;
  };
};

export const a11yActionInit = (state: A11yState): A11yAction => ({
  type: A11yActions.set,
  payload: {
    state,
  },
});

export const a11yActionSet = (key: string, value: string | string[] | boolean): A11yAction => ({
  type: A11yActions.set,
  payload: {
    key,
    value,
  },
});

const a11yReducer: Reducer<A11yState, A11yAction> = (state, action) => {
  switch (action.type) {
    case A11yActions.init: {
      return action.payload.state;
    }

    case A11yActions.set: {
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

export const useAccessibilityStructure = (
  structure: AccessibilityCategory[],
  initialState?: A11yState
): { renderedForm: React.ReactElement; state: A11yState; dispatch: Dispatch<A11yAction> } => {
  const language = useLanguage();

  const [state, dispatch] = useReducer(a11yReducer, initialState || {});

  const renderedElements = structure?.map((category, index) => {
    const currentTranslation = getTranslation(language, category.translations, true);
    return (
      <AccessibilityCategoryFactory
        key={index}
        title={currentTranslation?.attributes?.name}
        fieldGroups={category.children}
        state={state}
        dispatch={dispatch}
      />
    );
  });

  return {
    renderedForm: <div>{renderedElements}</div>,
    state,
    dispatch,
  };
};
