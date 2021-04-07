import { AppProps } from 'next/app';

import { Reset } from '../components/globals/Reset';

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Reset />
      <Component {...pageProps} />
    </>
  );
}

export default App;
