import { AppProps } from 'next/app';

import { UserContextProvider } from '../components/user/UserContext';
import { Reset } from '../components/globals/Reset';
import { Global } from '../components/globals/Global';
import { CSSVars } from '../components/globals/Constants';
import { Typography } from '../components/globals/Typography';
import { Breakpoint, useBreakpointOrWider, WindowContextProvider } from '../lib/WindowService';
import {
  NavigationContext,
  NavigationContextProvider,
} from '../components/navigation/NavigationContext';
import { BodyLock } from '../lib/BodyLock';
import { useContext, useMemo } from 'react';

const EmbeddedBodyLock: React.FC = () => {
  const { menuExpanded, navigationOpen, overlayOpen } = useContext(NavigationContext);
  const isMidOrWider = useBreakpointOrWider(Breakpoint.mid);

  const mobileMenuOpen = useMemo(() => !isMidOrWider && navigationOpen, [
    navigationOpen,
    isMidOrWider,
  ]);

  return <BodyLock conditions={[menuExpanded, overlayOpen, mobileMenuOpen]} />;
};

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <WindowContextProvider>
      <NavigationContextProvider>
        <UserContextProvider>
          {typeof window !== 'undefined' && <EmbeddedBodyLock />}
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
