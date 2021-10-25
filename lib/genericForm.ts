import { InputType } from '../components/input';
import { Language } from '../config/locale';
import { Translation } from './api/types/general';

export type GenericFormFieldValue = boolean | string | number | string[];

export type GenericFormFieldCondition = {
  key: string;
  type: GenericFormFieldConditionType;
  value: GenericFormFieldValue;
};

export type GenericFormFieldTooltip = {
  content: string[];
};

export type GenericFormTranslation = {
  attributes: {
    language: Language;
    name: string;
    placeholder?: string;
    tooltip?: GenericFormFieldTooltip;
  };
} & Translation;

export enum GenericFormFieldType {
  select = 'select',
  input = 'input',
  textarea = 'textarea',
  radioList = 'radioList',
  checkboxList = 'checkboxList',
  conditional = 'conditional',
}

export enum GenericFormFieldConditionType {
  equal = 'equal',
  unequal = 'unequal',
  include = 'include',
  exclude = 'exclude',
}

export interface GenericFormField {
  type: GenericFormFieldType;
  data: {
    key: string;
    value?: GenericFormFieldValue;
    options?: unknown;
  };
  translations?: GenericFormTranslation[];
  meta?: {
    hint?: GenericFormTranslation[];
  };
  condition?: GenericFormFieldCondition;
}

export interface GenericFormFieldSelect extends GenericFormField {
  type: GenericFormFieldType.select;
  data: {
    key: string;
    value?: string;
    options?: {
      value: string;
      translations: GenericFormTranslation[];
    }[];
  };
}

export interface GenericFormFieldInput extends GenericFormField {
  type: GenericFormFieldType.input;
  data: {
    key: string;
    type: InputType.url | InputType.number | InputType.email | InputType.text | InputType.tel;
    value?: string | number;
  };
}

export interface GenericFormFieldTextarea extends GenericFormField {
  type: GenericFormFieldType.textarea;
  data: {
    key: string;
    rows?: number;
    value?: string | number;
  };
}

export interface GenericFormFieldRadioList extends GenericFormField {
  type: GenericFormFieldType.radioList;
  data: {
    key: string;
    value?: boolean;
    options: {
      value: string;
      translations: GenericFormTranslation[];
    }[];
  };
}

export interface GenericFormFieldCheckboxList extends GenericFormField {
  type: GenericFormFieldType.checkboxList;
  data: {
    key: string;
    value?: string[];
    options: {
      value: string;
      translations: GenericFormTranslation[];
    }[];
  };
}

export interface GenericFormFieldGroup {
  children: (
    | GenericFormFieldInput
    | GenericFormFieldTextarea
    | GenericFormFieldSelect
    | GenericFormFieldRadioList
    | GenericFormFieldCheckboxList
    | GenericFormFieldConditional
  )[];
  translations?: GenericFormTranslation[];
}

export interface GenericFormFieldConditional extends GenericFormField {
  type: GenericFormFieldType.conditional;
  data: {
    key: string;
    fields: (
      | GenericFormFieldInput
      | GenericFormFieldTextarea
      | GenericFormFieldSelect
      | GenericFormFieldRadioList
      | GenericFormFieldCheckboxList
    )[];
    value?: boolean;
  };
}

export interface GenericFormCategory {
  children: GenericFormFieldGroup[];
  translations: GenericFormTranslation[];
}
