import { createRouter } from '../createRouter';
import {
  getEquipment,
  getRoomSizes,
  getTeachingTimes,
} from '../controllers/catalog.controller';

export const catalogRouter = createRouter()
  .query('times', {
    resolve: async () => await getTeachingTimes(),
  })
  .query('equipment', {
    resolve: async () => await getEquipment(),
  })
  .query('roomsize', {
    resolve: async () => await getRoomSizes(),
  });
// })
// .query('ofCluster', {
//     input: clusterSchema,
