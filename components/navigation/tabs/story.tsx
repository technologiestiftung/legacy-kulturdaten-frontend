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

export const TabsThreeItemsStory: Story = () => <Tabs links={testTabLinks.slice(0, 3)} />;
TabsThreeItemsStory.storyName = 'Tabs with 3 items';

export const TabsTwoItemsStory: Story = () => <Tabs links={testTabLinks.slice(0, 2)} />;
TabsTwoItemsStory.storyName = 'Tabs with 2 items';

export const TabsManyItemsStory: Story = () => (
  <Tabs links={[...testTabLinks, ...testTabLinks.slice(1), ...testTabLinks.slice(1, 4)]} />
);
TabsManyItemsStory.storyName = 'Tabs with many items';
