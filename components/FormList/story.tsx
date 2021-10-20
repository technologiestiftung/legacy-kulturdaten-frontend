import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
import { InputType } from '../input';
import { FormListConditional } from './FormListConditional';
import { FormListField, FormListFieldType } from './FormListField';
import { FormListGroup } from './FormListGroup';

export default {
  title: 'Form List',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const EmbeddedFormListDefaultStory: React.FC = () => {
  const [radioValue, setRadioValue] = useState('yes');
  const [radioValue2, setRadioValue2] = useState('yes');
  const [checkboxListValue, setCheckboxListValue] = useState(['1', '3']);
  const [conditionalChecked, setConditionalChecked] = useState(true);

  return (
    <StyledTestWrapper>
      <FormListGroup title="This is a group of fields">
        <FormListField
          type={FormListFieldType.input}
          label="Test Input"
          fieldProps={{
            type: InputType.text,
            id: 'id-1',
            placeholder: 'Text placeholder',
          }}
        />
        <FormListField
          type={FormListFieldType.select}
          label="Test Select"
          fieldProps={{
            id: 'id-2',
            children: (
              <>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </>
            ),
          }}
        />
        <FormListField
          type={FormListFieldType.radioList}
          label="Test Radio"
          fieldProps={{
            value: radioValue,
            onChange: (newValue: string) => setRadioValue(newValue),
            id: 'test-radio',
            name: 'test-radio',
            options: [
              {
                id: 'test01',
                label: 'Yes',
                value: 'yes',
              },
              {
                id: 'test02',
                label: 'No',
                value: 'no',
              },
            ],
          }}
        />
        <FormListConditional
          label="Optional fields"
          checked={conditionalChecked}
          onChange={(checked) => setConditionalChecked(checked)}
        >
          <FormListField
            type={FormListFieldType.input}
            label="Test Input"
            fieldProps={{
              type: InputType.text,
              id: 'id-12',
              placeholder: 'Text placeholder',
            }}
          />
          <FormListField
            type={FormListFieldType.select}
            label="Test Select"
            fieldProps={{
              id: 'id-22',
              children: (
                <>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </>
              ),
            }}
          />
          <FormListField
            type={FormListFieldType.radioList}
            label="Test Radio"
            fieldProps={{
              value: radioValue2,
              onChange: (newValue: string) => setRadioValue2(newValue),
              id: 'test-radio2',
              name: 'test-radio2',
              options: [
                {
                  id: 'test012',
                  label: 'Yes',
                  value: 'yes',
                },
                {
                  id: 'test022',
                  label: 'No',
                  value: 'no',
                },
              ],
            }}
          />
        </FormListConditional>
        <FormListField
          type={FormListFieldType.checkboxList}
          label="Test Checkboxes"
          fieldProps={{
            value: checkboxListValue,
            onChange: (updatedValues) => setCheckboxListValue(updatedValues),
            checkboxes: [
              {
                id: 'test11',
                label: 'The first checkbox',
                value: '1',
              },
              {
                id: 'test12',
                label: 'A second checkbox',
                value: '2',
              },
              {
                id: 'test13',
                label: 'Checkbox number three',
                value: '3',
              },
              {
                id: 'test14',
                label: 'It is #4',
                value: '4',
              },
              {
                id: 'test15',
                label: 'The fifth is not a king but checked',
                value: '5',
              },
            ],
          }}
        />
      </FormListGroup>
    </StyledTestWrapper>
  );
};

export const FormListDefaultStory: Story = () => <EmbeddedFormListDefaultStory />;
