import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
import { RadioList } from './RadioList';

export default {
  title: 'Radio',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const RadioListStory: Story = () => {
  const [value, setValue] = useState('5');

  return (
    <StyledTestWrapper>
      <RadioList
        value={value}
        onChange={(newValue) => setValue(newValue)}
        label="A list of radios"
        name="test-radio"
        options={[
          {
            id: 'test1',
            label: 'The first radio',
            value: '1',
          },
          {
            id: 'test2',
            label: 'A second radio',
            value: '2',
          },
          {
            id: 'test3',
            label: 'Radio number three',
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
            value: '5',
          },
        ]}
      />
    </StyledTestWrapper>
  );
};
RadioListStory.storyName = 'Radio List';
