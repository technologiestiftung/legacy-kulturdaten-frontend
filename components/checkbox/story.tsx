import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
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

export const CheckboxListStory: Story = () => {
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <StyledTestWrapper>
      <CheckboxList label="A list of checkboxes">
        <Checkbox id="test1" label="The first checkbox" />
        <Checkbox id="test2" label="A second checkbox" />
        <Checkbox id="test3" label="Checkbox number three" />
        <Checkbox id="test4" label="It is #4" />
        <Checkbox
          id="test5"
          label="The fifth is not a king but checked"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </CheckboxList>
    </StyledTestWrapper>
  );
};
CheckboxListStory.storyName = 'Checkbox List';
