import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  deleteNotification,
  readNotificationsOfUser,
  updateNotificationsOfUser,
} from '../services/notification.service';
import { TRPCError } from '@trpc/server';

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
