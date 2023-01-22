import { bigint, boolean, number, object, string, TypeOf } from 'zod';

export const clusterSchema = object({
  clustername: string(),
  clusterId: number(),
});

export type ClusterInput = TypeOf<typeof clusterSchema>;

export const clusterIdSchema = number();

export type ClusterIdSchema = TypeOf<typeof clusterIdSchema>;

export const clusterEditSchema = object({
  clusterId: bigint(),
  clustername: string(),
  description: string(),
  isPrivate: boolean(),
});

export type ClusterEditSchema = TypeOf<typeof clusterEditSchema>;

export const clusterCreateSchema = object({
  clustername: string(),
  description: string(),
  isPrivate: boolean(),
});

export type ClusterCreateSchema = TypeOf<typeof clusterCreateSchema>;
