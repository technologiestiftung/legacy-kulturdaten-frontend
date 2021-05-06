import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { Select, SelectSize, SelectVariant } from '.';

export default {
  title: 'Select',
};

const StyledTestWrapper = styled.div`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;
`;

export const SelectDefaultStory: Story = () => (
  <StyledTestWrapper>
    <Select id="select">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-2" label="With label">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-3" label="With icon" icon="Globe">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
  </StyledTestWrapper>
);
SelectDefaultStory.storyName = 'Select size=default variant=default';

export const SelectMinimalStory: Story = () => (
  <StyledTestWrapper>
    <Select id="select" variant={SelectVariant.minimal}>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-2" label="With label" variant={SelectVariant.minimal}>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-3" label="With icon" variant={SelectVariant.minimal} icon="Globe">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
  </StyledTestWrapper>
);
SelectMinimalStory.storyName = 'Select size=default variant=minimal';

export const SelectBigStory: Story = () => (
  <StyledTestWrapper>
    <Select id="select" size={SelectSize.big}>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-2" label="With label" size={SelectSize.big}>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
    <Select id="select-3" label="With icon" size={SelectSize.big} icon="Globe">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
  </StyledTestWrapper>
);
SelectBigStory.storyName = 'Select size=big variant=default';
