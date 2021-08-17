import { CategoryEntry } from '../../../lib/api/types/general';
import { DateFormat, useDate } from '../../../lib/date';

export const useSaveDate = (entry: CategoryEntry): string => {
  const date = useDate();

  const formattedDate = entry?.data?.attributes?.updatedAt
    ? date(new Date(entry?.data?.attributes.updatedAt), DateFormat.dateTime)
    : undefined;

  return formattedDate;
};
