export enum HoursWeekday {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

export const hoursWeekDayToNumber = (hoursWeekday: HoursWeekday): number =>
  [
    HoursWeekday.monday,
    HoursWeekday.tuesday,
    HoursWeekday.wednesday,
    HoursWeekday.thursday,
    HoursWeekday.friday,
    HoursWeekday.saturday,
    HoursWeekday.sunday,
  ].findIndex((value) => value === hoursWeekday);

export type Hours = {
  id?: number;
  attributes: {
    weekday: HoursWeekday;
    from: string;
    to: string;
  };
};

export type OpeningHours = Hours;

export type PeakHours = Hours;
