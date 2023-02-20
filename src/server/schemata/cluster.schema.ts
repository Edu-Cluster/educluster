import { boolean, number, object, string, array, TypeOf, bigint } from 'zod';

export const idNamePair = object({
  name: string(),
  id: number(),
});

export type ClusterInput = TypeOf<typeof idNamePair>;

export const clusterInvitationSchema = object({
  type: number(),
  clusterId: bigint(),
  userIds: array(bigint()),
});

export type ClusterInvitationSchema = TypeOf<typeof clusterInvitationSchema>;

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

export const updateMemberSchema = object({
  username: string(),
  clusterId: number(),
  type: number(),
});

export type UpdateMemberSchema = TypeOf<typeof updateMemberSchema>;
