import { format, getDay } from 'date-fns';
import { useLocale } from './routing';
import { dateFormatPatternMap } from '../config/locales';
import { useT } from './i18n';

const weekdays: {
  name: {
    long: string;
    short: string;
  };
}[] = [
  {
    name: {
      long: 'days.sunday.long',
      short: 'days.sunday.short',
    },
  },
  {
    name: {
      long: 'days.monday.long',
      short: 'days.monday.short',
    },
  },
  {
    name: {
      long: 'days.tuesday.long',
      short: 'days.tuesday.short',
    },
  },
  {
    name: {
      long: 'days.wednesday.long',
      short: 'days.wednesday.short',
    },
  },
  {
    name: {
      long: 'days.thursday.long',
      short: 'days.thursday.short',
    },
  },
  {
    name: {
      long: 'days.friday.long',
      short: 'days.friday.short',
    },
  },
  {
    name: {
      long: 'days.saturday.long',
      short: 'days.saturday.short',
    },
  },
];

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
