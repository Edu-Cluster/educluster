import { createRouter } from '../createRouter';
import {
  getEquipment,
  getRoomSizes,
  getSubjects,
  getTeachingTimes,
  getTopics,
} from '../controllers/catalog.controller';
import { string } from 'zod';

export const catalogRouter = createRouter()
  .query('times', {
    resolve: async () => await getTeachingTimes(),
  })
  .query('equipment', {
    resolve: async () => await getEquipment(),
  })
  .query('roomsize', {
    resolve: async () => await getRoomSizes(),
  })
  .query('subjects', {
    input: string(),
    resolve: async ({ input }) => await getSubjects({ input }),
  })
  .query('topics', {
    input: string(),
    resolve: async ({ input }) => await getTopics({ input }),
  });
