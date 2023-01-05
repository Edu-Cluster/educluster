import { number, object, string, TypeOf } from 'zod';

export const clusterSchema = object({
  clustername: string(),
  clusterId: number({ required_error: 'ClusterID ist erforderlich!' }),
});

export type ClusterInput = TypeOf<typeof clusterSchema>;

export const clusterIdSchema = number({
  required_error: 'Cluster Id ist erforderlich!',
});

export type ClusterIdSchema = TypeOf<typeof clusterIdSchema>;
