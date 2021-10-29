import { Story } from '@storybook/react';
import { Publish } from '.';
import { useCategories } from '../../config/categories';

export default {
  title: 'Publish',
};

export const PublishDefaultStory: Story = () => {
  const categories = useCategories();

  return <Publish category={categories.organizer} query={undefined} />;
};
