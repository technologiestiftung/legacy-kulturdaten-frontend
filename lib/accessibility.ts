import { InputType } from '../components/input';
import { Language } from '../config/locale';
import { Translation } from './api/types/general';

export type AccessibilityFieldValue = boolean | string | number | string[];

export type AccessibilityFieldCondition = {
  key: string;
  type: AccessibilityFieldConditionType;
  value: AccessibilityFieldValue;
};

export type AccessibilityFieldTooltip = {
  content: string[];
};

export type AccessibilityTranslation = {
  attributes: {
    language: Language;
    name: string;
    placeholder?: string;
    tooltip?: AccessibilityFieldTooltip;
  };
} & Translation;

export enum AccessibilityFieldType {
  select = 'select',
  input = 'input',
  textarea = 'textarea',
  radioList = 'radioList',
  checkboxList = 'checkboxList',
  conditional = 'conditional',
}

export enum AccessibilityFieldConditionType {
  equal = 'equal',
  unequal = 'unequal',
  include = 'include',
  exclude = 'exclude',
}

export interface AccessibilityField {
  type: AccessibilityFieldType;
  data: {
    key: string;
    value?: AccessibilityFieldValue;
    options?: unknown;
  };
  translations?: AccessibilityTranslation[];
  meta?: {
    hint?: AccessibilityTranslation[];
  };
  condition?: AccessibilityFieldCondition;
}

export interface AccessibilityFieldSelect extends AccessibilityField {
  type: AccessibilityFieldType.select;
  data: {
    key: string;
    value?: string;
    options?: {
      value: string;
      translations: AccessibilityTranslation[];
    }[];
  };
}

export interface AccessibilityFieldInput extends AccessibilityField {
  type: AccessibilityFieldType.input;
  data: {
    key: string;
    type: InputType.url | InputType.number | InputType.email | InputType.text | InputType.tel;
    value?: string | number;
  };
}

export interface AccessibilityFieldTextarea extends AccessibilityField {
  type: AccessibilityFieldType.textarea;
  data: {
    key: string;
    rows?: number;
    value?: string | number;
  };
}

export interface AccessibilityFieldRadioList extends AccessibilityField {
  type: AccessibilityFieldType.radioList;
  data: {
    key: string;
    value?: boolean;
    options: {
      value: string;
      translations: AccessibilityTranslation[];
    }[];
  };
}

export interface AccessibilityFieldCheckboxList extends AccessibilityField {
  type: AccessibilityFieldType.checkboxList;
  data: {
    key: string;
    value?: string[];
    options: {
      value: string;
      translations: AccessibilityTranslation[];
    }[];
  };
}

export interface AccessibilityFieldGroup {
  children: (
    | AccessibilityFieldInput
    | AccessibilityFieldTextarea
    | AccessibilityFieldSelect
    | AccessibilityFieldRadioList
    | AccessibilityFieldCheckboxList
    | AccessibilityFieldConditional
  )[];
  translations?: AccessibilityTranslation[];
}

export interface AccessibilityFieldConditional extends AccessibilityField {
  type: AccessibilityFieldType.conditional;
  data: {
    key: string;
    fields: (
      | AccessibilityFieldInput
      | AccessibilityFieldTextarea
      | AccessibilityFieldSelect
      | AccessibilityFieldRadioList
      | AccessibilityFieldCheckboxList
    )[];
    value?: boolean;
  };
}

export interface AccessibilityCategory {
  children: AccessibilityFieldGroup[];
  translations: AccessibilityTranslation[];
}
