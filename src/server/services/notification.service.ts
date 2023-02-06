import { prisma } from '../utils/prisma';

export const insertNewNotification = async (
  title: string,
  body: string,
  receiverId: bigint,
  sender: string,
) =>
  prisma.notifications.create({
    data: {
      sender,
      title,
      body,
      person_id: receiverId,
      viewed: false,
    },
  });

export const readNotificationsOfUser = async (id: bigint) =>
  prisma.notifications.findMany({
    where: {
      person_id: id,
    },
  });

export const updateNotificationsOfUser = async (id: bigint) =>
  prisma.notifications.updateMany({
    data: {
      viewed: true,
    },
    where: {
      person_id: id,
    },
  });
