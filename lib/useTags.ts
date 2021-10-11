import useSWR from 'swr';
import { ApiRoutes, getApiUrlString, useApiCall } from './api';
import { TagList, tagListFactory } from './api/routes/tags/list';
import { Tag } from './api/types/tag';

export const useTags: () => Tag[] = () => {
  const call = useApiCall();

  const { data } = useSWR(
    getApiUrlString(ApiRoutes.tagList, undefined),
    () => call<TagList>(tagListFactory, undefined),
    { revalidateOnFocus: false, focusThrottleInterval: 1000 * 60 * 5 }
  );

  return data?.body?.data;
};
