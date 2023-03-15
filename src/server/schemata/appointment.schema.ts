import { any, array, number, object, string, TypeOf } from 'zod';

export const appointmentCreateSchema = object({
  name: string(),
  description: string(),
  date: string(),
  timeFrom: string(),
  timeTo: string(),
  subject: string(),
  topics: array(string()),
  roomname: any(),
  clusterId: number(),
});

export type AppointmentCreateSchema = TypeOf<typeof appointmentCreateSchema>;

export const appointmentAdvancedSearchSchema = object({
  timeFrom: any(),
  timeTo: any(),
  dateFrom: any(),
  dateTo: any(),
  subject: any(),
  topics: any(),
  name: any(),
});

export type AppointmentAdvancedSearchSchema = TypeOf<
  typeof appointmentAdvancedSearchSchema
>;
