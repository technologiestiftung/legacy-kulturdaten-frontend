import Downloader from 'js-file-downloader';
import getConfig from 'next/config';
import { useCallback } from 'react';
import { makeBearer } from '.';
import { useAuthToken } from '../../components/user/UserContext';

const publicRuntimeConfig = getConfig ? getConfig()?.publicRuntimeConfig : undefined;
const api = publicRuntimeConfig?.api || 'https://beta.api.kulturdaten.berlin';

export const useDownload = (): ((
  route: string,
  fileName: string,
  onProcess?: (e: ProgressEvent) => void
) => void) => {
  const authToken = useAuthToken();

  const callback = useCallback(
    (route: string, fileName: string, onProcess?: (e: ProgressEvent) => void) => {
      const url = new URL(route, api).toString();

      const downloader = new Downloader({
        url,
        headers: [{ name: 'Authorization', value: makeBearer(authToken) }],
        autoStart: false,
        contentTypeDetermination: 'header',
        filename: fileName,
        forceDesktopMode: true,
        process: onProcess as (e: ProgressEvent) => undefined,
      });

      downloader.start().catch((error) => {
        console.error(error);
      });
    },
    [authToken]
  );

  return callback;
};
