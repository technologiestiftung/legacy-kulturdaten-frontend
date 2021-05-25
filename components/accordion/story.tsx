import { Story } from '@storybook/react';
import { Accordion } from '.';

export default {
  title: 'Accordion',
};

export const AccordionDefaultStory: Story = () => (
  <Accordion
    items={[
      {
        title: 'Accordion item 1',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 2',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 3',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 4',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 5',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 6',
        content: <div>Some content</div>,
      },
      {
        title: 'Accordion item 7',
        content: <div>Some content</div>,
      },
    ]}
  />
);
