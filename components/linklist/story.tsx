import { Story } from '@storybook/react';
import { LinkList } from '.';

export default {
  title: 'Link List',
};

export const LinkListDefaultStory: Story = () => (
  <LinkList
    links={[
      {
        value: 'https://www.technologiestiftung-berlin.de/',
      },
      {
        value: 'https://www.kulturdaten.berlin/',
      },
      {
        value: 'https://beta.api.kulturdaten.berlin/docs/',
      },
    ]}
    label="Social Media Links"
  />
);
