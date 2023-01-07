import { bigint, number, object, string, TypeOf } from 'zod';

export const clusterSchema = object({
  clustername: string({ required_error: 'Clustername ist erforderlich!' }),
  clusterId: number({ required_error: 'ClusterID ist erforderlich!' }),
});

export type ClusterInput = TypeOf<typeof clusterSchema>;

export const clusterInviteSchema = object({
  clusterId: number({ required_error: 'ClusterID ist erforderlich!' }),
  userId: bigint({ required_error: 'BenutzerId ist erforderlich!' }),
});

export type ClusterInviteSchema = TypeOf<typeof clusterInviteSchema>;
