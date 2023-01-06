import { createRouter } from '../createRouter';
import {
  getItemOfUserHandler,
  getItemOfClusterHandler,
} from '../controllers/item.controller';
import { clusterSchema } from '../schemata/cluster.schema';

export const itemRouter = createRouter()
  .query('mine', {
    resolve: async ({ ctx }) => await getItemOfUserHandler({ ctx }),
  })
  .query('ofCluster', {
    input: clusterSchema,
    resolve: async ({ input }) => await getItemOfClusterHandler({ input }),
  });
