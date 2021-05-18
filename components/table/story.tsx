import { Story } from '@storybook/react';
import { Table } from '.';

export default {
  title: 'Table',
};

const testContent = [
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
  { contents: ['Altes Museum', 'Lorem Ipsum', '11.05.2021'] },
];

export const TableDefaultStory: Story = () => (
  <Table
    columns={[
      { title: 'Bezeichnung', bold: true },
      { title: 'Lorem' },
      { title: 'Bearbeitungsdatum' },
    ]}
    content={testContent}
  />
);
TableDefaultStory.storyName = 'Table default';

export const TableNarrowStory: Story = () => (
  <Table
    columns={[
      { title: 'Bezeichnung', bold: true },
      { title: 'Lorem' },
      { title: 'Bearbeitungsdatum' },
    ]}
    content={testContent}
    narrow
  />
);
TableNarrowStory.storyName = 'Table narrow';
