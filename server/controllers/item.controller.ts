import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  provisionallyInviteUser,
  readAppointmentsFromUser,
  readAppointmentsOfCluster,
  readClusterFromUser,
  readClusternameOfCluster,
  readUsersOfCluster,
} from '../services/item.service';
import { ClusterIdSchema, ClusterInput } from '../schemata/cluster.schema';

export const getItemOfUserHandler = async ({
  ctx,
}: {
  ctx: ContextWithUser;
}) => {
  try {
    const user = ctx.user;

    if (!user) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    const cluster = await readClusterFromUser(user.username);
    const appointments = await readAppointmentsFromUser(user.username);

    return {
      status: statusCodes.SUCCESS,
      data: {
        appointments,
        cluster,
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

export const getItemOfClusterHandler = async ({
  input,
}: {
  input: ClusterInput;
}) => {
  try {
    const clustercheck = await readClusternameOfCluster(input.clusterId);

    if (clustercheck?.clustername !== input.clustername) {
      return { status: statusCodes.FAILURE };
    }

    const user = await readUsersOfCluster(input.clusterId);
    const appointments = await readAppointmentsOfCluster(input.clusterId);

    return {
      status: statusCodes.SUCCESS,
      data: {
        user,
        appointments,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const sendMemberInvitation = async ({
  input,
  ctx,
}: {
  input: ClusterIdSchema;
  ctx: ContextWithUser;
}) => {
  try {
    const user = ctx.user;

    if (!user) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    const id = user.id;
    const result = await provisionallyInviteUser(id, input);

    if (result) {
      return {
        status: statusCodes.SUCCESS,
      };
    }
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
