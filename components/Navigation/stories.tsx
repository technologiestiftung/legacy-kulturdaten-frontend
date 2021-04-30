import { Story } from '@storybook/react';
import React from 'react';
import { Header } from './Header';

export default {
  title: 'Navigation',
};

const TestLink: React.FC<{ content: React.ReactElement }> = ({
  content,
}: {
  content: React.ReactElement;
}) => <>{React.cloneElement(content, { href: '#' })}</>;

export const HeaderStory: Story = () => <Header title="Kulturdaten.Berlin" Link={TestLink} />;
HeaderStory.storyName = 'Header';
