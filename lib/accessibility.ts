import { InputType } from '../components/input';
import { Language } from '../config/locale';
import { Translation } from './api/types/general';

export type AccessibilityTranslation = {
  attributes: {
    language: Language;
    name: string;
  };
} & Translation;

export enum AccessibilityFieldType {
  select = 'select',
  input = 'input',
  radioList = 'radioList',
  checkboxList = 'checkboxList',
  conditional = 'conditional',
}

export interface AccessibilityField {
  type: AccessibilityFieldType;
  data: {
    key: string;
    value?: boolean | string | number | string[];
    options?: unknown;
  };
  translations?: AccessibilityTranslation[];
  meta?: {
    hint?: AccessibilityTranslation[];
  };
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
    | AccessibilityFieldSelect
    | AccessibilityFieldRadioList
    | AccessibilityFieldCheckboxList
    | AccessibilityFieldConditional
  )[];
  translations: AccessibilityTranslation[];
}

export interface AccessibilityFieldConditional extends AccessibilityField {
  type: AccessibilityFieldType.conditional;
  data: {
    key: string;
    fields: (
      | AccessibilityFieldInput
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
