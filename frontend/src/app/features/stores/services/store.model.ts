export const WEEKDAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  imageUrl: string;
  closedDay: Weekday;
  openingHours: Record<Weekday, string | null>;
}
