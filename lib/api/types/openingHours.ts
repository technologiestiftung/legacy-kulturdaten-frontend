export enum OpeningHoursWeekday {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

export type OpeningHours = {
  id?: number;
  attributes: {
    weekday: OpeningHoursWeekday;
    from: string;
    to: string;
  };
};
