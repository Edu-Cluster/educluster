import { createRouter } from '../createRouter';
import { getTeachingTimes } from '../controllers/catalog.controller';

export const catalogRouter = createRouter().query('times', {
  resolve: async ({ ctx }) => await getTeachingTimes({ ctx }),
  // })
  // .query('ofCluster', {
  //     input: clusterSchema,
  //     resolve: async ({ input }) => await getItemOfClusterHandler({ input }),
});
