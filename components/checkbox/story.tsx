import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { Checkbox } from '.';
import { CheckboxList } from './CheckboxList';

export default {
  title: 'Checkbox',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const CheckboxDefaultStory: Story = () => (
  <StyledTestWrapper>
    <Checkbox id="test1" label="Checkbox with a name" />
  </StyledTestWrapper>
);
CheckboxDefaultStory.storyName = 'Default Checkbox';

export const CheckboxDisabledStory: Story = () => (
  <StyledTestWrapper>
    <Checkbox id="test1" label="Unchecked disabled checkbox" disabled />
    <Checkbox id="test2" label="Checked disabled checkbox" disabled checked />
  </StyledTestWrapper>
);
CheckboxDisabledStory.storyName = 'Disabled Checkbox';

export const CheckboxListStory: Story = () => {
  return (
    <StyledTestWrapper>
      <CheckboxList
        label="A list of checkboxes"
        checkboxes={[
          {
            id: 'test1',
            label: 'The first checkbox',
            value: '1',
          },
          {
            id: 'test2',
            label: 'A second checkbox',
            value: '2',
          },
          {
            id: 'test3',
            label: 'Checkbox number three',
            value: '3',
          },
          {
            id: 'test4',
            label: 'It is #4',
            value: '4',
          },
          {
            id: 'test5',
            label: 'The fifth is not a king but checked',
            checked: true,
            value: '5',
          },
        ]}
      />
    </StyledTestWrapper>
  );
};
CheckboxListStory.storyName = 'Checkbox List';
