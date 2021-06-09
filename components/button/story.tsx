import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import React from 'react';
import { Button, ButtonColor, ButtonSize, ButtonVariant, IconPosition } from '.';

export default {
  title: 'Button',
};

const TestWrapper = styled.div<{ background?: string; color?: string }>`
  padding: 1.5rem;
  display: grid;
  row-gap: 1.5rem;
  grid-template-columns: auto;
  justify-items: flex-start;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

export const ButtonStory: Story = () => (
  <TestWrapper>
    <Button onClick={() => console.log('ejo')} icon="LogOut">
      Button
    </Button>
    <Button color={ButtonColor.blue} onClick={() => console.log('ejo')} icon="LogOut">
      Button
    </Button>
    <Button
      color={ButtonColor.green}
      onClick={() => console.log('ejo')}
      icon="ArrowLeft"
      iconPosition={IconPosition.left}
    >
      Button
    </Button>
    <Button color={ButtonColor.yellow} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button color={ButtonColor.red} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button color={ButtonColor.white} onClick={() => console.log('ejo')}>
      Button
    </Button>
  </TestWrapper>
);

ButtonStory.storyName = 'Button size=default variant=default';

export const ButtonMinimalStory: Story = () => (
  <>
    <TestWrapper>
      <Button variant={ButtonVariant.minimal} onClick={() => console.log('ejo')} icon="LogOut">
        Button
      </Button>
    </TestWrapper>
    <TestWrapper background="var(--grey-200)">
      <Button variant={ButtonVariant.minimal} onClick={() => console.log('ejo')}>
        Button
      </Button>
    </TestWrapper>
    <TestWrapper background="var(--black)" color="var(--white)">
      <Button variant={ButtonVariant.minimal} onClick={() => console.log('ejo')}>
        Button
      </Button>
    </TestWrapper>
  </>
);
ButtonMinimalStory.storyName = 'Button size=default variant=minimal';

export const ButtonBorderlessStory: Story = () => (
  <>
    <TestWrapper>
      <Button variant={ButtonVariant.borderless} onClick={() => console.log('ejo')} icon="LogOut">
        Button
      </Button>
    </TestWrapper>
    <TestWrapper background="var(--grey-200)">
      <Button variant={ButtonVariant.borderless} onClick={() => console.log('ejo')}>
        Button
      </Button>
    </TestWrapper>
    <TestWrapper background="var(--black)" color="var(--white)">
      <Button
        variant={ButtonVariant.borderless}
        onClick={() => console.log('ejo')}
        color={ButtonColor.black}
      >
        Button
      </Button>
    </TestWrapper>
  </>
);
ButtonBorderlessStory.storyName = 'Button size=default variant=borderless';

export const ButtonSmallStory: Story = () => (
  <TestWrapper>
    <Button size={ButtonSize.small} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button
      size={ButtonSize.small}
      color={ButtonColor.blue}
      onClick={() => console.log('ejo')}
      icon="LogOut"
    >
      Button
    </Button>
    <Button
      size={ButtonSize.small}
      color={ButtonColor.green}
      onClick={() => console.log('ejo')}
      icon="ArrowLeft"
      iconPosition={IconPosition.left}
    >
      Button
    </Button>
    <Button size={ButtonSize.small} color={ButtonColor.yellow} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button size={ButtonSize.small} color={ButtonColor.red} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button size={ButtonSize.small} color={ButtonColor.white} onClick={() => console.log('ejo')}>
      Button
    </Button>
  </TestWrapper>
);

ButtonSmallStory.storyName = 'Button size=small variant=default';

export const ButtonBigStory: Story = () => (
  <TestWrapper>
    <Button size={ButtonSize.big} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button
      size={ButtonSize.big}
      color={ButtonColor.blue}
      onClick={() => console.log('ejo')}
      icon="LogOut"
    >
      Button
    </Button>
    <Button
      size={ButtonSize.big}
      color={ButtonColor.green}
      onClick={() => console.log('ejo')}
      icon="ArrowLeft"
      iconPosition={IconPosition.left}
    >
      Button
    </Button>
    <Button size={ButtonSize.big} color={ButtonColor.yellow} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button size={ButtonSize.big} color={ButtonColor.red} onClick={() => console.log('ejo')}>
      Button
    </Button>
    <Button size={ButtonSize.big} color={ButtonColor.white} onClick={() => console.log('ejo')}>
      Button
    </Button>
  </TestWrapper>
);

ButtonBigStory.storyName = 'Button size=big variant=default';
