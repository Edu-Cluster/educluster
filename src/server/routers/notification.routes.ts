import { createRouter } from '../createRouter';
import {
  deleteOneNotification,
  getNotifications,
  markAllNotificationsAsViewed,
  sendAppointmentDeletedWarning,
  sendClusterDeletedWarning,
} from '../controllers/notification.controller';
import { bigint } from 'zod';
import {
  appointmentNotificationSchema,
  clusterNotificationSchema,
} from '../schemata/notification.schema';

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
  })
  .mutation('warningAppointmentDeleted', {
    input: appointmentNotificationSchema,
    resolve: ({ ctx, input }) => sendAppointmentDeletedWarning({ ctx, input }),
  })
  .mutation('warningClusterDeleted', {
    input: clusterNotificationSchema,
    resolve: ({ ctx, input }) => sendClusterDeletedWarning({ ctx, input }),
  });
