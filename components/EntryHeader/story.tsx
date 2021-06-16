import { Story } from '@storybook/react';
import { EntryHeader } from '.';
import { Button, ButtonVariant, IconPosition } from '../button';
import { Tabs } from '../navigation/tabs';

export default {
  title: 'Entry Header',
};

const testTabLinks = [
  {
    title: 'Informationen',
    href: '#',
    isActive: true,
  },
  {
    title: 'Kategorisierung',
    href: '#',
  },
  {
    title: 'Bilder',
    href: '#',
  },
  {
    title: 'Vorschau',
    href: '#',
  },
];

export const EntryHeaderDefaultStory: Story = () => {
  return (
    <EntryHeader
      backButton={
        <Button icon="ArrowLeft" iconPosition={IconPosition.left} variant={ButtonVariant.minimal}>
          zurück
        </Button>
      }
      actions={[
        <Button key={1} icon="Users" variant={ButtonVariant.minimal}>
          Zugriffsrechte
        </Button>,
        <Button key={2} icon="Archive" variant={ButtonVariant.minimal}>
          Export
        </Button>,
      ]}
      title="This is a very long title"
      tabs={<Tabs links={testTabLinks} />}
    />
  );
};
