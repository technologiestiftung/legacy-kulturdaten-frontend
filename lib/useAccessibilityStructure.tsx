import { useState } from 'react';
import { useCollapsable } from '../components/collapsable';
import { EntryFormHead } from '../components/EntryForm/EntryFormHead';
import { FormListConditional } from '../components/FormList/FormListConditional';
import { FormListField, FormListFieldType } from '../components/FormList/FormListField';
import { FormListGroup } from '../components/FormList/FormListGroup';
import { InputType } from '../components/input';
import { FormGrid, FormItem, FormItemWidth } from '../components/pages/helpers/formComponents';
import {
  AccessibilityCategory,
  AccessibilityField,
  AccessibilityFieldCheckboxList,
  AccessibilityFieldConditional,
  AccessibilityFieldGroup,
  AccessibilityFieldInput,
  AccessibilityFieldRadioList,
  AccessibilityFieldSelect,
  AccessibilityFieldType,
} from './accessibility';
import { useLanguage } from './routing';
import { getTranslation } from './translations';
import { usePseudoUID } from './uid';

interface AccessibilityFormListFieldContainerProps {
  field: AccessibilityField;
  last?: boolean;
}

const AccessibilityFormListFieldContainer: React.FC<AccessibilityFormListFieldContainerProps> = ({
  field,
  last,
}: AccessibilityFormListFieldContainerProps) => {
  const language = useLanguage();
  const currentTranslation = getTranslation(language, field.translations, true);
  const uid = usePseudoUID();

  const label = currentTranslation?.attributes?.name || '';

  switch (field?.type) {
    case AccessibilityFieldType.conditional: {
      return (
        <FormListConditional last={last} checked={true} onChange={() => undefined} label={label}>
          {(field as AccessibilityFieldConditional).data?.fields?.map((field, index) => (
            <AccessibilityFormListFieldContainer key={index} field={field} />
          ))}
        </FormListConditional>
      );
    }

    case AccessibilityFieldType.input: {
      return (
        <FormListField
          last={last}
          type={FormListFieldType.input}
          label={label}
          fieldProps={{
            value: '',
            id: `${uid}-input`,
            type: (field.data as unknown as AccessibilityFieldInput).type as unknown as InputType,
          }}
        />
      );
    }

    case AccessibilityFieldType.select: {
      return (
        <FormListField
          last={last}
          type={FormListFieldType.select}
          label={label}
          fieldProps={{
            id: `${uid}-select`,
            children: (
              <>
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
          type={FormListFieldType.radioList}
          label={label}
          fieldProps={{
            id: `${uid}-radio-list`,
            name: `${uid}-radio-list`,
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
          type={FormListFieldType.checkboxList}
          label={label}
          fieldProps={{
            id: `${uid}-radio-list`,
            name: `${uid}-radio-list`,
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
      return <div>empty</div>;
    }
  }
};

interface AccessibilityCategoryContainerProps {
  title: string;
  fieldGroups: AccessibilityFieldGroup[];
}

const AccessibilityCategoryContainer: React.FC<AccessibilityCategoryContainerProps> = ({
  title,
  fieldGroups,
}: AccessibilityCategoryContainerProps) => {
  const language = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderedGroups = (
    <FormGrid>
      {fieldGroups?.map((group, index) => {
        const currentTranslation = getTranslation(language, group.translations, true);
        return (
          <FormItem key={index} width={FormItemWidth.full}>
            <FormListGroup title={currentTranslation?.attributes?.name}>
              {group.children.map((field, index) => (
                <AccessibilityFormListFieldContainer key={index} field={field} />
              ))}
            </FormListGroup>
          </FormItem>
        );
      })}
    </FormGrid>
  );

  const { renderedCollapsable } = useCollapsable(renderedGroups, isCollapsed, setIsCollapsed);

  return (
    <div>
      <EntryFormHead
        title={title}
        expander={{
          isExpanded: !isCollapsed,
          onClick: () => setIsCollapsed(!isCollapsed),
        }}
      />
      {renderedCollapsable}
    </div>
  );
};

export const useAccessibilityStructure = (
  structure: AccessibilityCategory[]
): { renderedForm: React.ReactElement } => {
  const language = useLanguage();

  const renderedElements = structure?.map((category, index) => {
    const currentTranslation = getTranslation(language, category.translations, true);
    return (
      <AccessibilityCategoryContainer
        key={index}
        title={currentTranslation?.attributes?.name}
        fieldGroups={category.children}
      />
    );
  });

  return {
    renderedForm: <div>{renderedElements}</div>,
  };
};
