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
  boolean = 'boolean',
  group = 'group',
}

export interface AccessibilityField {
  type: AccessibilityFieldType;
  data: {
    key: string;
    value: boolean | string | number;
  };
  translations: AccessibilityTranslation[];
  meta?: {
    hint?: AccessibilityTranslation[];
  };
}

export interface AccessibilityFieldSelect extends AccessibilityField {
  type: AccessibilityFieldType.select;
  data: {
    key: string;
    value: string;
    options: {
      key: string;
      translations: AccessibilityTranslation[];
    }[];
    multiple: boolean;
  };
}

export interface AccessibilityFieldInput extends AccessibilityField {
  type: AccessibilityFieldType.input;
  data: {
    key: string;
    type: InputType.url | InputType.number | InputType.email | InputType.text | InputType.tel;
    value: string | number;
  };
}

export interface AccessibilityFieldBoolean extends AccessibilityField {
  type: AccessibilityFieldType.boolean;
  data: {
    key: string;
    value: boolean;
  };
}

export interface AccessibilityFieldGroup extends AccessibilityField {
  type: AccessibilityFieldType.group;
  data: {
    key: string;
    value: boolean;
    fields: AccessibilityField[];
  };
}

export interface AccessibilityCategory {
  children: [AccessibilityCategory | AccessibilityField];
  translations: AccessibilityTranslation[];
}
