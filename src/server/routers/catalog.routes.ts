import { createRouter } from '../createRouter';
import { getTeachingTimes } from '../controllers/catalog.controller';

export const catalogRouter = createRouter().query('times', {
  resolve: async ({ ctx }) => await getTeachingTimes({ ctx }),
  // })
  // .query('equipment', {
  //   resolve: async ({ ctx }) => await getEquipment({ ctx }),
  // })
  // .query('roomsize', {
  //   resolve: async ({ ctx }) => await getRoomSizes({ ctx }),
});
// })
// .query('ofCluster', {
//     input: idNamePair,
//     resolve: async ({ input }) => await getItemOfClusterHandler({ input }),
