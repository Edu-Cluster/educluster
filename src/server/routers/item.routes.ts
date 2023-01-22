import { createRouter } from '../createRouter';
import {
  getItemOfUserHandler,
  getItemOfClusterHandler,
  sendMemberInvitation,
  updateCluster,
} from '../controllers/item.controller';
import {
  clusterIdSchema,
  clusterSchema,
  clusterEditSchema,
} from '../schemata/cluster.schema';

export const itemRouter = createRouter()
  .query('mine', {
    resolve: async ({ ctx }) => await getItemOfUserHandler({ ctx }),
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
  });
