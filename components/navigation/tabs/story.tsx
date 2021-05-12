import { Story } from '@storybook/react';
import { Tabs } from '.';

export default {
  title: 'Tabs',
};

const testTabLinks = [
  {
    title: 'Übersicht',
    href: '#',
    isActive: true,
  },
  {
    title: 'Informationen',
    href: '#',
  },
  {
    title: 'Zugriffsrechte',
    href: '#',
  },
  {
    title: 'Export',
    href: '#',
  },
];

export const TabsDefaultStory: Story = () => <Tabs links={testTabLinks} />;
TabsDefaultStory.storyName = 'Tabs default';

export const TabsManyItemsStory: Story = () => (
  <Tabs links={[...testTabLinks, ...testTabLinks.slice(1), ...testTabLinks.slice(1)]} />
);
TabsManyItemsStory.storyName = 'Tabs with many items';
