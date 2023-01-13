// @ts-nocheck
import { prisma } from '../utils/prisma';

// const maxCountForPage = 5;
export const readTeachingTimes = async () =>
  await prisma.teaching_times.findMany({
    select: { teaching_hour: true, begin: true, end: true },
    orderBy: { teaching_hour: 'asc' },
  });
