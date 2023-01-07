import { createRouter } from '../createRouter';
import {
  getItemOfUserHandler,
  getItemOfClusterHandler,
  sendMemberInvitation,
} from '../controllers/item.controller';
import { clusterInviteSchema, clusterSchema } from '../schemata/cluster.schema';

export const itemRouter = createRouter()
  .query('mine', {
    resolve: async ({ ctx }) => await getItemOfUserHandler({ ctx }),
  })
  .query('ofCluster', {
    input: clusterSchema,
    resolve: async ({ input }) => await getItemOfClusterHandler({ input }),
  })
  .mutation('inviteToCluster', {
    input: clusterInviteSchema,
    resolve: async ({ input }) => await sendMemberInvitation({ input }),
  });
