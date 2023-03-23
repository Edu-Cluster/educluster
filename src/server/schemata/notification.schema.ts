import { array, bigint, object, string, TypeOf } from 'zod';

export const clusterNotificationSchema = object({
  clusterId: bigint(),
  clusterName: string(),
  userIds: array(bigint()),
});

export type ClusterNotificationSchema = TypeOf<
  typeof clusterNotificationSchema
>;

export const appointmentNotificationSchema = object({
  appointmentId: bigint(),
  appointmentName: string(),
  userIds: array(bigint()),
});

export type AppointmentNotificationSchema = TypeOf<
  typeof appointmentNotificationSchema
>;
