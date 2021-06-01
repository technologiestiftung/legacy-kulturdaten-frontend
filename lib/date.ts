import { format } from 'date-fns';
import { useLocale } from './routing';
import { dateFormatPatternMap } from '../config/locales';

export enum DateFormat {
  date = 'date',
  time = 'time',
  dateTime = 'dateTime',
}

export const useDate = (): ((date: Date, dateFormat: DateFormat) => string) => {
  const locale = useLocale();

  return (date, dateFormat) => format(date, dateFormatPatternMap[dateFormat][locale]);
};
