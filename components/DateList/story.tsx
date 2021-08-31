import { Story } from '@storybook/react';
import { useDateList } from '.';
import { dummyDates } from '../../dummy-data/dates';

export default {
  title: 'Date List',
};

export const DateListDefaultStory: Story = () => {
  const { renderedDateList } = useDateList({ dates: dummyDates });

  return <div>{renderedDateList}</div>;
};
