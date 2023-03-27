import { AppProps } from 'next/app';

import { UserContextProvider } from '../components/user/UserContext';
import { Reset } from '../components/globals/Reset';
import { Global } from '../components/globals/Global';
import { CSSVars } from '../components/globals/Constants';
import { Typography } from '../components/globals/Typography';
import { WindowContext, WindowContextProvider } from '../lib/WindowService';
import { NavigationContextProvider } from '../components/navigation/NavigationContext';
import { useContext } from 'react';
import {
  AdminListContext,
  EntryListContextProvider,
} from '../components/EntryList/EntryListContext';
import { Categories } from '../config/categories';
import { AppLayout, useLayout } from '../components/layouts/AppLayout';
import { useNavigation } from '../components/navigation';
import { useAppTitle, useMenuStructure } from '../config/structure';
import { HeaderLink } from '../components/navigation/header/HeaderLink';
import { LoadingContextProvider } from '../components/Loading/LoadingContext';
import { AdminContextProvider } from '../components/Admin/AdminContext';
import { useHandleActiveOrganizer } from '../lib/useOrganizer';
import { ConfirmContextProvider } from '../components/Confirm/ConfirmContext';
import { DownloadContextProvider } from '../components/Download/DownloadContext';

const EmbeddedAppLayout: React.FC<{ content: React.ReactElement }> = ({
  content,
}: {
  content: React.ReactElement;
}) => {
  const NavigationStructure = useMenuStructure();
  const appTitle = useAppTitle();
  const { rendered } = useContext(WindowContext);
  const layout = useLayout();
  const { header, sidebar } = useNavigation(NavigationStructure, appTitle, HeaderLink, layout);

  useHandleActiveOrganizer();

  return rendered ? (
    <AppLayout header={header} sidebar={sidebar} content={content} layout={layout} />
  ) : null;
};

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <WindowContextProvider>
      <NavigationContextProvider>
        <LoadingContextProvider>
          <ConfirmContextProvider>
            <EntryListContextProvider
              listNames={[Categories.organizer, Categories.location, Categories.offer]}
            >
              <EntryListContextProvider
                listNames={[Categories.organizer]}
                Context={AdminListContext}
              >
                <UserContextProvider>
                  <AdminContextProvider>
                    <DownloadContextProvider>
                      <Reset />
                      <CSSVars />
                      <Global />
                      <Typography />
                      <EmbeddedAppLayout content={<Component {...pageProps} />} />
                    </DownloadContextProvider>
                  </AdminContextProvider>
                </UserContextProvider>
              </EntryListContextProvider>
            </EntryListContextProvider>
          </ConfirmContextProvider>
        </LoadingContextProvider>
      </NavigationContextProvider>
    </WindowContextProvider>
  );
}

export default App;

