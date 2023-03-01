import { number, object, date, string, TypeOf } from 'zod';

export const specificRoomsSchema = object({
  sizeMin: number(),
  sizeMax: number(),
  equipment: string(),
  from: date(),
  to: date(),
});

export type SpecificRoomsSchema = TypeOf<typeof specificRoomsSchema>;
