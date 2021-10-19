import { useState } from 'react';
import { useCollapsable } from '../collapsable';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { AccessibilityFieldFactory } from './AccessibilityFieldFactory';
import { FormListGroup } from '../FormList/FormListGroup';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import {
  AccessibilityFieldCondition,
  AccessibilityFieldConditionType,
  AccessibilityFieldGroup,
} from '../../lib/accessibility';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { A11yState, A11yStateConsumer } from './useAccessibilityStructure';

interface AccessibilityCategoryContainerProps extends A11yStateConsumer {
  title: string;
  fieldGroups: AccessibilityFieldGroup[];
}

const validateCondition = (state: A11yState, condition: AccessibilityFieldCondition): boolean => {
  if (condition) {
    switch (condition.type) {
      case AccessibilityFieldConditionType.equal: {
        return state[condition.key] === condition.value;
      }

      case AccessibilityFieldConditionType.unequal: {
        return state[condition.key] !== condition.value;
      }
      case AccessibilityFieldConditionType.include: {
        return (
          Array.isArray(state[condition.key]) &&
          (state[condition.key] as string[]).includes(condition.value as string)
        );
      }
      case AccessibilityFieldConditionType.exclude: {
        return (
          !Array.isArray(state[condition.key]) ||
          !(state[condition.key] as string[]).includes(condition.value as string)
        );
      }
    }
  }

  return true;
};

export const AccessibilityCategoryFactory: React.FC<AccessibilityCategoryContainerProps> = ({
  title,
  fieldGroups,
  state,
  dispatch,
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
              {group.children.map((field, index) =>
                validateCondition(state, field.condition) ? (
                  <AccessibilityFieldFactory
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
