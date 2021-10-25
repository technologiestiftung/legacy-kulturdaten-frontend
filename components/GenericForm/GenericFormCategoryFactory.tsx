import { useState } from 'react';
import { useCollapsable } from '../collapsable';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { GenericFormFieldFactory } from './GenericFormFieldFactory';
import { FormListGroup } from '../FormList/FormListGroup';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import {
  GenericFormFieldCondition,
  GenericFormFieldConditionType,
  GenericFormFieldGroup,
} from '../../lib/genericForm';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { GenericFormState, GenericFormStateConsumer } from './useGenericFormStructure';

interface GenericFormCategoryContainerProps extends GenericFormStateConsumer {
  fieldGroups: GenericFormFieldGroup[];
  title?: string;
  collapsable?: boolean;
}

const validateCondition = (
  state: GenericFormState,
  condition: GenericFormFieldCondition
): boolean => {
  if (condition) {
    switch (condition.type) {
      case GenericFormFieldConditionType.equal: {
        return state[condition.key] === condition.value;
      }

      case GenericFormFieldConditionType.unequal: {
        return state[condition.key] !== condition.value;
      }

      case GenericFormFieldConditionType.include: {
        const transformedValue =
          (state[condition.key] as string)?.charAt(0) === '[' &&
          (state[condition.key] as string)?.charAt((state[condition.key] as string).length - 1) ===
            ']'
            ? (state[condition.key] as string).replace('[', '').replace(']', '').split(',')
            : [];

        return (
          Array.isArray(transformedValue) &&
          (transformedValue as string[]).includes(condition.value as string)
        );
      }

      case GenericFormFieldConditionType.exclude: {
        const transformedValue =
          (state[condition.key] as string)?.charAt(0) === '[' &&
          (state[condition.key] as string)?.charAt((state[condition.key] as string).length - 1) ===
            ']'
            ? (state[condition.key] as string).replace('[', '').replace(']', '').split(',')
            : [];

        return (
          !Array.isArray(transformedValue) ||
          !(transformedValue as string[]).includes(condition.value as string)
        );
      }
    }
  }

  return true;
};

export const GenericFormCategoryFactory: React.FC<GenericFormCategoryContainerProps> = ({
  title,
  fieldGroups,
  state,
  dispatch,
  collapsable = true,
}: GenericFormCategoryContainerProps) => {
  const language = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const renderedGroups = (
    <FormGrid>
      {fieldGroups?.map((group, index) => {
        const currentTranslation = getTranslation(language, group.translations, true);
        return (
          <FormItem key={index} width={FormItemWidth.full}>
            <FormListGroup title={currentTranslation?.attributes?.name}>
              {group.children.map((field, index) =>
                validateCondition(state, field.condition) ? (
                  <GenericFormFieldFactory
                    key={index}
                    field={field}
                    state={state}
                    dispatch={dispatch}
                  />
                ) : null
              )}
            </FormListGroup>
          </FormItem>
        );
      })}
    </FormGrid>
  );

  const { renderedCollapsable } = useCollapsable(renderedGroups, isCollapsed, setIsCollapsed);

  return collapsable && title ? (
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
  ) : (
    <div>
      {title && <EntryFormHead title={title} />}
      {renderedGroups}
    </div>
  );
};
