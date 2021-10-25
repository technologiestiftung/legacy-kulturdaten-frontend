export enum HoursWeekday {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

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
