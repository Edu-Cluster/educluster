import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  deleteNotification,
  insertNewNotification,
  readNotificationsOfUser,
  updateNotificationsOfUser,
} from '../services/notification.service';
import { TRPCError } from '@trpc/server';
import {
  AppointmentNotificationSchema,
  ClusterNotificationSchema,
} from '../schemata/notification.schema';

export const getNotifications = async ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const id = ctx?.user?.id;

    if (!id) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    const notifications = await readNotificationsOfUser(id);

    return {
      data: {
        notifications,
        status: statusCodes.SUCCESS,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

export const markAllNotificationsAsViewed = async ({
  ctx,
}: {
  ctx: ContextWithUser;
}) => {
  try {
    const id = ctx?.user?.id;

    if (!id) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    await updateNotificationsOfUser(id);

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

export const deleteOneNotification = async ({ input }: { input: bigint }) => {
  try {
    await deleteNotification(input);

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

export const sendAppointmentDeletedWarning = async ({
  ctx,
  input,
}: {
  ctx: ContextWithUser;
  input: AppointmentNotificationSchema;
}) => {
  try {
    const username = ctx?.user?.username || '';

    for (const id of input.userIds) {
      await insertNewNotification(
        'Warnung',
        `Die Lerneinheit "${input.appointmentName}#${input.appointmentId}" wurde gelöscht!`,
        id,
        username,
      );
    }

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

export const sendClusterDeletedWarning = async ({
  ctx,
  input,
}: {
  ctx: ContextWithUser;
  input: ClusterNotificationSchema;
}) => {
  try {
    const username = ctx?.user?.username || '';

    for (const id of input.userIds) {
      await insertNewNotification(
        'Warnung',
        `Der Cluster "${input.clusterName}#${input.clusterId}" wurde gelöscht!`,
        id,
        username,
      );
    }

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
