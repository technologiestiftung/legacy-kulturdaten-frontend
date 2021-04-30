import { addDecorator } from '@storybook/react';
import { Reset } from '../components/globals/Reset';

addDecorator((story) => {
  return (
    <>
      <Reset />
      {story()}
    </>
  );
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
};
