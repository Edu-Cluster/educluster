import { createRouter } from '../createRouter';
import {
  getNotifications,
  markAllNotificationsAsViewed,
} from '../controllers/notification.controller';

export const notificationRouter = createRouter()
  .query('getAll', {
    resolve: ({ ctx }) => getNotifications({ ctx }),
  })
  .mutation('setAllViewed', {
    resolve: ({ ctx }) => markAllNotificationsAsViewed({ ctx }),
  });
