import { createRouter } from '../createRouter';
import {
  deleteOneNotification,
  getNotifications,
  markAllNotificationsAsViewed,
} from '../controllers/notification.controller';
import { bigint } from 'zod';

export const notificationRouter = createRouter()
  .query('getAll', {
    resolve: ({ ctx }) => getNotifications({ ctx }),
  })
  .mutation('setAllViewed', {
    resolve: ({ ctx }) => markAllNotificationsAsViewed({ ctx }),
  })
  .mutation('deleteOne', {
    input: bigint(),
    resolve: ({ input }) => deleteOneNotification({ input }),
  });
