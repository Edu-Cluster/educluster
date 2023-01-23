import { createRouter } from '../createRouter';
import {
  getItemOfUserHandler,
  getItemOfClusterHandler,
  sendMemberInvitation,
  updateCluster,
  createCluster,
  getPublicClusters,
  getRooms,
  getClusterDetails,
  getPublicAppointments,
} from '../controllers/item.controller';
import {
  clusterIdSchema,
  clusterSchema,
  clusterEditSchema,
  clusterCreateSchema,
} from '../schemata/cluster.schema';
import { number, string } from 'zod';

export const itemRouter = createRouter()
  .query('mine', {
    resolve: async ({ ctx }) => await getItemOfUserHandler({ ctx }),
  })
  .query('clusterDetails', {
    input: number(),
    resolve: async ({ input }) => await getClusterDetails({ input }),
  })
  .query('ofCluster', {
    input: clusterSchema,
    resolve: async ({ input }) => await getItemOfClusterHandler({ input }),
  })
  .mutation('inviteToCluster', {
    input: clusterIdSchema,
    resolve: async ({ input, ctx }) =>
      await sendMemberInvitation({ input, ctx }),
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
  .query('rooms', {
    input: string(),
    resolve: async ({ input }) => await getRooms({ input }),
  });
