import { addDecorator } from '@storybook/react';
import { Global } from '../components/globals/Global';
import { CSSVars } from '../components/globals/Constants';
import { Typography } from '../components/globals/Typography';
import { Reset } from '../components/globals/Reset';
import { WindowContextProvider } from '../lib/WindowService';
import { NavigationContextProvider } from '../components/navigation/NavigationContext';
import { EntryListContextProvider } from '../components/EntryList/EntryListContext';
import { Categories } from '../config/categories';
import { PreventDrop } from '../lib/PreventDrop';

addDecorator((story) => {
  return (
    <>
      <Reset />
      <CSSVars />
      <Global />
      <Typography />
      <PreventDrop />
      <WindowContextProvider>
        <NavigationContextProvider>
          <EntryListContextProvider
            listNames={[Categories.organizer, Categories.location, Categories.offer]}
          >
            {story()}
          </EntryListContextProvider>
        </NavigationContextProvider>
      </WindowContextProvider>
    </>
  );
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
};
