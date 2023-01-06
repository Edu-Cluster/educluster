import { number, object, string, TypeOf } from 'zod';

export const clusterSchema = object({
  clustername: string(),
  clusterId: number({ required_error: 'ClusterID ist erforderlich!' }),
});

export type ClusterInput = TypeOf<typeof clusterSchema>;
