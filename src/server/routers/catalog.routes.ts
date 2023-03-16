import { createRouter } from '../createRouter';
import {
  getAllSubjects,
  getEquipment,
  getRoomSizes,
  getSubjects,
  getTeachingTimes,
  getTopics,
  getTopicsBySubject,
} from '../controllers/catalog.controller';
import { any, string } from 'zod';

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
  .query('allSubjects', {
    resolve: async () => await getAllSubjects(),
  })
  .query('topics', {
    input: string(),
    resolve: async ({ input }) => await getTopics({ input }),
  })
  .query('topicsBySubject', {
    input: any(),
    resolve: async ({ input }) => await getTopicsBySubject({ input }),
  });
