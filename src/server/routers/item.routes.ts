import { createRouter } from '../createRouter';
import {
  getItemOfUserHandler,
  getItemOfClusterHandler,
  sendMemberInvitation,
  updateCluster,
  createCluster,
  getPublicClusters,
  getClusterDetails,
  getPublicAppointments,
  getClusterAssociation,
  getMembersOfCluster,
  updateMemberOfCluster,
  removeMemberFromCluster,
  addMemberToCluster,
  getItemOfAppointmentHandler,
  getSpecificRooms,
} from '../controllers/item.controller';
import {
  idNamePair,
  clusterEditSchema,
  clusterCreateSchema,
  updateMemberSchema,
  clusterInvitationSchema,
} from '../schemata/cluster.schema';
import { number, string } from 'zod';
import { specificRoomsSchema } from '../schemata/room.schema';

export const itemRouter = createRouter()
  .query('mine', {
    resolve: async ({ ctx }) => await getItemOfUserHandler({ ctx }),
  })
  .query('clusterDetails', {
    input: number(),
    resolve: async ({ input }) => await getClusterDetails({ input }),
  })
  .query('ofCluster', {
    input: idNamePair,
    resolve: async ({ input, ctx }) =>
      await getItemOfClusterHandler({ input, ctx }),
  })
  .query('ofAppointment', {
    input: idNamePair,
    resolve: async ({ input, ctx }) =>
      await getItemOfAppointmentHandler({ input, ctx }),
  })
  .query('membersOfCluster', {
    input: number(),
    resolve: async ({ input, ctx }) =>
      await getMembersOfCluster({ input, ctx }),
  })
  .mutation('updateMemberOfCluster', {
    input: updateMemberSchema,
    resolve: async ({ input }) => await updateMemberOfCluster({ input }),
  })
  .mutation('removeMemberFromCluster', {
    input: updateMemberSchema,
    resolve: async ({ input }) => await removeMemberFromCluster({ input }),
  })
  .query('clusterAssociation', {
    input: number(),
    resolve: async ({ input, ctx }) =>
      await getClusterAssociation({ input, ctx }),
  })
  .mutation('inviteToCluster', {
    input: clusterInvitationSchema,
    resolve: async ({ input, ctx }) =>
      await sendMemberInvitation({ input, ctx }),
  })
  .mutation('addMemberToCluster', {
    input: number(),
    resolve: async ({ input, ctx }) => await addMemberToCluster({ input, ctx }),
  })
  .mutation('updateCluster', {
    input: clusterEditSchema,
    resolve: async ({ input }) => await updateCluster({ input }),
  })
  .mutation('createCluster', {
    input: clusterCreateSchema,
    resolve: async ({ input, ctx }) => await createCluster({ input, ctx }),
  })
  .query('appointments', {
    input: string(),
    resolve: async ({ input }) => await getPublicAppointments({ input }),
  })
  .query('clusters', {
    input: string(),
    resolve: async ({ input }) => await getPublicClusters({ input }),
  })
  .mutation('specificRooms', {
    input: specificRoomsSchema,
    resolve: async ({ input }) => await getSpecificRooms({ input }),
  });
