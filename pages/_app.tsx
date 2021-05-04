import { AppProps } from 'next/app';

import { UserContextProvider } from '../components/user/UserContext';
import { Reset } from '../components/globals/Reset';
import { Global } from '../components/globals/Global';
import { CSSVars } from '../components/globals/Constants';
import { Typography } from '../components/globals/Typography';
import { WindowContextProvider } from '../lib/WindowService';
import { NavigationContextProvider } from '../components/navigation/NavigationContext';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <WindowContextProvider>
      <NavigationContextProvider>
        <UserContextProvider>
          <Reset />
          <CSSVars />
          <Global />
          <Typography />
          <Component {...pageProps} />
        </UserContextProvider>
      </NavigationContextProvider>
    </WindowContextProvider>
  );
}

export default App;
