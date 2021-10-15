import { format, getDay } from 'date-fns';
import { useLocale } from './routing';
import { dateFormatPatternMap } from '../config/locales';
import { useT } from './i18n';
import { weekdays } from '../components/DayPicker';

export enum DateFormat {
  date = 'date',
  time = 'time',
  dateTime = 'dateTime',
  dayDateTime = 'dayDateTime',
}

export const useDate = (): ((date: Date, dateFormat: DateFormat) => string) => {
  const locale = useLocale();
  const t = useT();

  return (date, dateFormat) => {
    const formattedDate = format(date, dateFormatPatternMap[dateFormat][locale]);

    return `${
      dateFormat === DateFormat.dayDateTime ? `${t(weekdays[getDay(date)].name.short)}. ` : ''
    }${formattedDate}`;
  };
};
