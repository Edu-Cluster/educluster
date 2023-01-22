import { TRPCError } from '@trpc/server';
import { Appointment, Cluster, ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  provisionallyInviteUser,
  readAppointmentsFromUser,
  readAppointmentsOfCluster,
  readClusterFromUser,
  readClusterById,
  readUsersOfCluster,
  updateClusterById,
  createNewCluster,
  addNewClusterAdmin,
  readClusterByClustername,
  readPublicClusters,
  readPublicAppointments,
} from '../services/item.service';
import {
  ClusterIdSchema,
  ClusterInput,
  ClusterEditSchema,
  ClusterCreateSchema,
} from '../schemata/cluster.schema';

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

export const getClusterDetails = async ({ input }: { input: number }) => {
  try {
    const clusterDetails = await readClusterById(input);

    if (!clusterDetails) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    return {
      status: statusCodes.SUCCESS,
      data: {
        clusterDetails,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const getItemOfClusterHandler = async ({
  input,
}: {
  input: ClusterInput;
}) => {
  try {
    const clusterDetails = await readClusterById(input.clusterId);

    if (clusterDetails?.clustername !== input.clustername) {
      return { status: statusCodes.FAILURE };
    }

    const user = await readUsersOfCluster(input.clusterId);
    const appointments = await readAppointmentsOfCluster(input.clusterId);

    return {
      status: statusCodes.SUCCESS,
      data: {
        user,
        appointments,
        clusterDetails,
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

export const updateCluster = async ({
  input,
}: {
  input: ClusterEditSchema;
}) => {
  try {
    const { isPrivate, clustername, clusterId, description } = input;

    await updateClusterById(clusterId, clustername, description, isPrivate);

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const createCluster = async ({
  input,
  ctx,
}: {
  input: ClusterCreateSchema;
  ctx: ContextWithUser;
}) => {
  try {
    const { user } = ctx;
    const { isPrivate, clustername, description } = input;

    if (await readClusterByClustername(clustername)) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    await createNewCluster({
      clustername,
      description,
      isPrivate,
      teamsId: `teams_${clustername}`, // TODO Denis: teamsId holen
      creator: user?.id,
    });

    const result = await readClusterByClustername(clustername);
    await addNewClusterAdmin(user?.id, result?.id);

    return {
      data: {
        id: result?.id,
      },
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const getPublicAppointments = async ({ input }: { input: string }) => {
  try {
    const appointments: any[][] = [];
    const publicAppointments = await readPublicAppointments(input);

    let page = 0;
    let pageClusters: Appointment[] = [];
    publicAppointments.forEach((appointment) => {
      if (pageClusters.length === 10) {
        page++;
        appointments.push(pageClusters);
        pageClusters = [];
      } else {
        pageClusters.push(appointment);
      }
    });

    if (!appointments.length) {
      appointments.push(pageClusters);
    }

    return {
      status: statusCodes.SUCCESS,
      data: {
        appointments,
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

export const getPublicClusters = async ({ input }: { input: string }) => {
  try {
    const clusters: any[][] = [];
    const publicClusters = await readPublicClusters(input);

    let page = 0;
    let pageClusters: Cluster[] = [];
    publicClusters.forEach((cluster) => {
      if (pageClusters.length === 10) {
        page++;
        clusters.push(pageClusters);
        pageClusters = [];
      } else {
        pageClusters.push(cluster);
      }
    });

    if (!clusters.length) {
      clusters.push(pageClusters);
    }

    return {
      status: statusCodes.SUCCESS,
      data: {
        clusters,
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

export const getRooms = async ({ input }: { input: string }) => {
  try {
    // TODO Denis: read available rooms from webuntis
    // TODO Denis: Auch mit input funktional machen

    return {
      status: statusCodes.SUCCESS,
      data: {
        rooms: null,
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
