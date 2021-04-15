import { AppProps } from 'next/app';

import { UserContextProvider } from '../components/user/UserContext';
import { Reset } from '../components/globals/Reset';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <UserContextProvider>
        <Reset />
        <Component {...pageProps} />
      </UserContextProvider>
    </>
  );
}

export default App;
