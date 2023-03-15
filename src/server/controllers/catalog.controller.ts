import { TRPCError } from '@trpc/server';
import { statusCodes } from '../../lib/enums';
import {
  readEquipment,
  readRoomSizes,
  readSubjects,
  readTeachingTimes,
  readTopics,
} from '../services/catalog.service';
import { Cluster } from '../../lib/types';

export const getTeachingTimes = async () => {
  try {
    const times = await readTeachingTimes();
    return {
      status: statusCodes.SUCCESS,
      data: {
        times,
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
export const getEquipment = async () => {
  try {
    const equipment = await readEquipment();
    return {
      status: statusCodes.SUCCESS,
      data: {
        equipment,
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
export const getRoomSizes = async () => {
  try {
    const roomsizes = await readRoomSizes();
    return {
      status: statusCodes.SUCCESS,
      data: {
        roomsizes,
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

export const getSubjects = async ({ input }: { input: string }) => {
  try {
    const subjects = await readSubjects(input);

    return {
      status: statusCodes.SUCCESS,
      data: {
        subjects: subjects.map((subject) => subject.name),
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

export const getTopics = async ({ input }: { input: string }) => {
  try {
    const topics = await readTopics(input);

    return {
      status: statusCodes.SUCCESS,
      data: {
        topics: topics.map((topic) => topic.name),
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
