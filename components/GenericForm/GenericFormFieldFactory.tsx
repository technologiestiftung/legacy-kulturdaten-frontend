import { FormListConditional } from '../FormList/FormListConditional';
import { FormListField, FormListFieldType } from '../FormList/FormListField';
import { InputType } from '../input';
import {
  GenericFormField,
  GenericFormFieldCheckboxList,
  GenericFormFieldConditional,
  GenericFormFieldInput,
  GenericFormFieldRadioList,
  GenericFormFieldSelect,
  GenericFormFieldTags,
  GenericFormFieldTextarea,
  GenericFormFieldType,
} from '../../lib/genericForm';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { usePseudoUID } from '../../lib/uid';
import { genericFormActionSet, GenericFormStateConsumer } from './useGenericFormStructure';
import { useMemo } from 'react';
import { useT } from '../../lib/i18n';
import { Tag } from '../../lib/api/types/tag';

interface GenericFormListFieldContainerProps extends GenericFormStateConsumer {
  field: GenericFormField;
  last?: boolean;
  first?: boolean;
}

export const GenericFormFieldFactory: React.FC<GenericFormListFieldContainerProps> = ({
  field,
  last,
  first,
  state,
  dispatch,
}: GenericFormListFieldContainerProps) => {
  const language = useLanguage();
  const currentTranslation = getTranslation(language, field.translations, true);
  const uid = usePseudoUID();
  const t = useT();

  const label = currentTranslation?.attributes?.name || '';

  const key = field?.data?.key;
  const value = useMemo(() => (state && key ? state[key] : undefined), [state, key]);

  switch (field?.type) {
    case GenericFormFieldType.conditional: {
      return (
        <FormListConditional
          last={last}
          checked={typeof value === 'string' ? value === 'true' : (value as boolean)}
          onChange={(checked) => dispatch(genericFormActionSet(key, checked))}
          label={label}
        >
          {(field as GenericFormFieldConditional).data?.fields?.map((field, index) => (
            <GenericFormFieldFactory key={index} field={field} state={state} dispatch={dispatch} />
          ))}
        </FormListConditional>
      );
    }

    case GenericFormFieldType.input: {
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
            type: (field as unknown as GenericFormFieldInput).data.type as InputType,
            placeholder: currentTranslation?.attributes?.placeholder,
            onChange: (e) => dispatch(genericFormActionSet(key, e.target.value)),
          }}
        />
      );
    }

    case GenericFormFieldType.textarea: {
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
            rows: (field as unknown as GenericFormFieldTextarea)?.data?.rows,
            onChange: (e) => dispatch(genericFormActionSet(key, e.target.value)),
          }}
        />
      );
    }

    case GenericFormFieldType.select: {
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
            onChange: (e) => dispatch(genericFormActionSet(key, e.target.value)),
            children: (
              <>
                <option value="undefined" key="-1">
                  {currentTranslation?.attributes?.placeholder || t('general.choose')}
                </option>
                {(field as GenericFormFieldSelect).data?.options?.map((option, optionIndex) => {
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

    case GenericFormFieldType.radioList: {
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
            onChange: (newValue) => dispatch(genericFormActionSet(key, newValue)),
            options: (field as GenericFormFieldRadioList)?.data?.options?.map(
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

    case GenericFormFieldType.checkboxList: {
      const transformedValue =
        (value as string)?.charAt(0) === '[' &&
        (value as string)?.charAt((value as string).length - 1) === ']'
          ? (value as string).replace('[', '').replace(']', '').split(',')
          : [];

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
            value: (transformedValue as string[]) || [],
            onChange: (newValues) =>
              dispatch(genericFormActionSet(key, `[${newValues.toString()}]`)),
            checkboxes: (field as GenericFormFieldCheckboxList)?.data?.options?.map(
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

    case GenericFormFieldType.tags: {
      const transformedValue =
        (value as string)?.charAt(0) === '[' &&
        (value as string)?.charAt((value as string).length - 1) === ']'
          ? (value as string).replace('[', '').replace(']', '').split(',')
          : [];

      return (
        <FormListField
          last={last}
          first={first}
          type={FormListFieldType.tags}
          label={label}
          tooltip={currentTranslation?.attributes?.tooltip}
          fieldProps={{
            id: `${uid}-tags`,
            name: `${uid}-tags`,
            value: (transformedValue as string[]) || [],
            i18nKeys: (field as GenericFormFieldTags)?.data?.i18nKeys,
            onChange: (newValues) =>
              dispatch(genericFormActionSet(key, `[${newValues.toString()}]`)),
            options: (field as GenericFormFieldTags)?.data?.options?.map<Tag>((option) => {
              return {
                id: option.value,
                relations: {
                  translations: option.translations,
                },
              };
            }),
          }}
        />
      );
    }

    default: {
      return null;
    }
  }
};
