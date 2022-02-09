export enum HoursWeekday {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

const hoursWeekdays = [
  HoursWeekday.monday,
  HoursWeekday.tuesday,
  HoursWeekday.wednesday,
  HoursWeekday.thursday,
  HoursWeekday.friday,
  HoursWeekday.saturday,
  HoursWeekday.sunday,
];

export const hoursWeekDayToNumber = (hoursWeekday: HoursWeekday): number =>
  hoursWeekdays.findIndex((value) => value === hoursWeekday);

export const dayNumberToHoursWeekday = (day: number): HoursWeekday => hoursWeekdays[day];

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
