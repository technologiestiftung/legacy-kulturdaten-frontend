import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { Select, SelectSize, SelectVariant } from '.';

export default {
  title: 'Select',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: auto;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
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
  <>
    <StyledTestWrapper>
      <Select id="select-1-1" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-1-2" label="With label" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-1-3" label="With icon" variant={SelectVariant.minimal} icon="Globe">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
    <StyledTestWrapper background="var(--grey-200)">
      <Select id="select-2-1" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-2-2" label="With label" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-2-3" label="With icon" variant={SelectVariant.minimal} icon="Globe">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
    <StyledTestWrapper background="var(--black)" color="var(--white)">
      <Select id="select-3-1" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-3-2" label="With label" variant={SelectVariant.minimal}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select id="select-3-3" label="With icon" variant={SelectVariant.minimal} icon="Globe">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
  </>
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

export const SelectMinimalBigStory: Story = () => (
  <>
    <StyledTestWrapper>
      <Select id="select-1-1" variant={SelectVariant.minimal} size={SelectSize.big}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-1-2"
        label="With label"
        variant={SelectVariant.minimal}
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-1-3"
        label="With icon"
        variant={SelectVariant.minimal}
        icon="Globe"
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
    <StyledTestWrapper background="var(--grey-200)">
      <Select id="select-2-1" variant={SelectVariant.minimal} size={SelectSize.big}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-2-2"
        label="With label"
        variant={SelectVariant.minimal}
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-2-3"
        label="With icon"
        variant={SelectVariant.minimal}
        icon="Globe"
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
    <StyledTestWrapper background="var(--black)" color="var(--white)">
      <Select id="select-3-1" variant={SelectVariant.minimal} size={SelectSize.big}>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-3-2"
        label="With label"
        variant={SelectVariant.minimal}
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
      <Select
        id="select-3-3"
        label="With icon"
        variant={SelectVariant.minimal}
        icon="Globe"
        size={SelectSize.big}
      >
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    </StyledTestWrapper>
  </>
);
SelectMinimalBigStory.storyName = 'Select size=big variant=minimal';
