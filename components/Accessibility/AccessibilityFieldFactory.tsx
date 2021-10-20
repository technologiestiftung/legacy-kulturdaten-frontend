import { FormListConditional } from '../FormList/FormListConditional';
import { FormListField, FormListFieldType } from '../FormList/FormListField';
import { InputType } from '../input';
import {
  AccessibilityField,
  AccessibilityFieldCheckboxList,
  AccessibilityFieldConditional,
  AccessibilityFieldInput,
  AccessibilityFieldRadioList,
  AccessibilityFieldSelect,
  AccessibilityFieldTextarea,
  AccessibilityFieldType,
} from '../../lib/accessibility';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { a11yActionSet, A11yStateConsumer } from './useAccessibilityStructure';
import { useMemo } from 'react';
import { useT } from '../../lib/i18n';

interface AccessibilityFormListFieldContainerProps extends A11yStateConsumer {
  field: AccessibilityField;
  last?: boolean;
  first?: boolean;
}

export const AccessibilityFieldFactory: React.FC<AccessibilityFormListFieldContainerProps> = ({
  field,
  last,
  first,
  state,
  dispatch,
}: AccessibilityFormListFieldContainerProps) => {
  const language = useLanguage();
  const currentTranslation = getTranslation(language, field.translations, true);
  const uid = usePseudoUID();
  const t = useT();

  const label = currentTranslation?.attributes?.name || '';

  const key = field?.data?.key;
  const value = useMemo(() => (state && key ? state[key] : undefined), [state, key]);

  switch (field?.type) {
    case AccessibilityFieldType.conditional: {
      return (
        <FormListConditional
          last={last}
          checked={value as boolean}
          onChange={(checked) => dispatch(a11yActionSet(key, checked))}
          label={label}
        >
          {(field as AccessibilityFieldConditional).data?.fields?.map((field, index) => (
            <AccessibilityFieldFactory
              key={index}
              field={field}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </FormListConditional>
      );
    }

    case AccessibilityFieldType.input: {
      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.input}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            value: (value as string) || '',
            id: `${uid}-input`,
            type: (field as unknown as AccessibilityFieldInput).data.type as InputType,
            placeholder: currentTranslation?.attributes?.placeholder,
            onChange: (e) => dispatch(a11yActionSet(key, e.target.value)),
          }}
        />
      );
    }

    case AccessibilityFieldType.textarea: {
      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.textarea}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            value: (value as string) || '',
            id: `${uid}-textarea`,
            placeholder: currentTranslation?.attributes?.placeholder,
            rows: (field as unknown as AccessibilityFieldTextarea)?.data?.rows,
            onChange: (e) => dispatch(a11yActionSet(key, e.target.value)),
          }}
        />
      );
    }

    case AccessibilityFieldType.select: {
      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.select}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            value: (value as string) || 'undefined',
            id: `${uid}-select`,
            onChange: (e) => dispatch(a11yActionSet(key, e.target.value)),
            children: (
              <>
                <option value="undefined" key="-1">
                  {currentTranslation?.attributes?.placeholder || t('general.choose')}
                </option>
                {(field as AccessibilityFieldSelect).data?.options?.map((option, optionIndex) => {
                  const optionTranslation = getTranslation(language, option.translations);

                  return (
                    <option value={option.value} key={optionIndex}>
                      {optionTranslation.attributes.name}
                    </option>
                  );
                })}
              </>
            ),
          }}
        />
      );
    }

    case AccessibilityFieldType.radioList: {
      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.radioList}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            id: `${uid}-radio-list`,
            name: `${uid}-radio-list`,
            value: (value as string) || '',
            onChange: (newValue) => dispatch(a11yActionSet(key, newValue)),
            options: (field as AccessibilityFieldRadioList)?.data?.options?.map(
              (option, optionIndex) => {
                const optionTranslation = getTranslation(language, option.translations);

                return {
                  id: `${uid}-radio-list-${optionIndex}`,
                  label: optionTranslation.attributes.name,
                  value: option.value,
                };
              }
            ),
          }}
        />
      );
    }

    case AccessibilityFieldType.checkboxList: {
      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.checkboxList}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            id: `${uid}-radio-list`,
            name: `${uid}-radio-list`,
            value: (value as string[]) || [],
            onChange: (newValues) => dispatch(a11yActionSet(key, newValues)),
            checkboxes: (field as AccessibilityFieldCheckboxList)?.data?.options?.map(
              (option, optionIndex) => {
                const optionTranslation = getTranslation(language, option.translations);

                return {
                  id: `${uid}-radio-list-${optionIndex}`,
                  label: optionTranslation.attributes.name,
                  value: option.value,
                };
              }
            ),
          }}
        />
      );
    }

    default: {
      return null;
    }
  }
};
