// @ts-nocheck
import { prisma } from '../utils/prisma';

// const maxCountForPage = 5;
export const readTeachingTimes = async () =>
  await prisma.teaching_times.findMany({
    select: { teaching_hour: true, begin: true, end_: true },
    orderBy: { teaching_hour: 'asc' },
  });

export const readRoomSizes = async () =>
  await prisma.room_size.findMany({
    orderBy: { minimum: 'asc' },
  });

export const readEquipment = async () =>
  await prisma.equipment.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
  });
