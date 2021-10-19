import { useState } from 'react';
import { useCollapsable } from '../collapsable';
import { EntryFormHead } from '../EntryForm/EntryFormHead';
import { AccessibilityFieldFactory } from './AccessibilityFieldFactory';
import { FormListGroup } from '../FormList/FormListGroup';
import { FormGrid, FormItem, FormItemWidth } from '../pages/helpers/formComponents';
import { AccessibilityFieldGroup } from '../../lib/accessibility';
import { useLanguage } from '../../lib/routing';
import { getTranslation } from '../../lib/translations';
import { A11yStateConsumer } from './useAccessibilityStructure';

interface AccessibilityCategoryContainerProps extends A11yStateConsumer {
  title: string;
  fieldGroups: AccessibilityFieldGroup[];
}

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
              {group.children.map((field, index) => (
                <AccessibilityFieldFactory
                  key={index}
                  field={field}
                  state={state}
                  dispatch={dispatch}
                />
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
