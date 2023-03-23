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

export const readSubjects = async (name) =>
  await prisma.subject.findMany({
    where: {
      name: { contains: name },
    },
  });

export const readAllSubjects = async () => await prisma.subject.findMany();

export const readTopics = async (name) =>
  await prisma.topic.findMany({
    where: {
      name: { contains: name },
    },
  });

export const readAllTopics = async () =>
  await prisma.topic.findMany({
    where: {
      is_visible: true,
    },
  });

export const readTopicsBySubject = async (name) =>
  await prisma.topic.findMany({
    where: {
      subject: { contains: name },
      is_visible: true,
    },
  });
