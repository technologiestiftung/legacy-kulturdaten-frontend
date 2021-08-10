import { AppProps } from 'next/app';

import { UserContextProvider } from '../components/user/UserContext';
import { Reset } from '../components/globals/Reset';
import { Global } from '../components/globals/Global';
import { CSSVars } from '../components/globals/Constants';
import { Typography } from '../components/globals/Typography';
import { WindowContext, WindowContextProvider } from '../lib/WindowService';
import { NavigationContextProvider } from '../components/navigation/NavigationContext';
import { useContext } from 'react';
import { EntryListContextProvider } from '../components/EntryList/EntryListContext';
import { Categories } from '../config/categories';
import { AppLayout } from '../components/layouts/AppLayout';
import { useNavigation } from '../components/navigation';
import { useAppTitle, useMenuStructure } from '../config/structure';
import { HeaderLink } from '../components/navigation/header/HeaderLink';

const EmbeddedAppLayout: React.FC<{ content: React.ReactElement }> = ({
  content,
}: {
  content: React.ReactElement;
}) => {
  const NavigationStructure = useMenuStructure();
  const appTitle = useAppTitle();

  const { rendered } = useContext(WindowContext);
  const { header, sidebar } = useNavigation(NavigationStructure, appTitle, HeaderLink);

  return rendered ? <AppLayout header={header} sidebar={sidebar} content={content} /> : null;
};

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <WindowContextProvider>
      <NavigationContextProvider>
        <EntryListContextProvider
          listNames={[Categories.organizer, Categories.location, Categories.offer]}
        >
          <UserContextProvider>
            <Reset />
            <CSSVars />
            <Global />
            <Typography />

            <EmbeddedAppLayout content={<Component {...pageProps} />} />
          </UserContextProvider>
        </EntryListContextProvider>
      </NavigationContextProvider>
    </WindowContextProvider>
  );
}

export default App;
