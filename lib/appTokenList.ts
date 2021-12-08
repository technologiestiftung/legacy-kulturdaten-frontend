import useSWR from 'swr';
import { useApiCall, apiRoutes } from './api';
import { AppTokenList, appTokenListFactory } from './api/routes/appToken/list';
import { AppToken } from './api/types/appToken';

export const useAppTokenList = (): {
  appTokens: AppToken['data']['attributes'][];
  mutate: () => void;
} => {
  const call = useApiCall();

  const { data, mutate } = useSWR(
    apiRoutes.appToken,
    () => call<AppTokenList>(appTokenListFactory, undefined),
    {
      revalidateOnFocus: false,
      focusThrottleInterval: 1000 * 60 * 5,
    }
  );

  return {
    appTokens: data?.body?.meta?.tokens as unknown as AppToken['data']['attributes'][],
    mutate,
  };
};
