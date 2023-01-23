import { TRPCError } from '@trpc/server';
import { Cluster, ContextWithUser } from '../../lib/types';
import { clusterAssociations, statusCodes } from '../../lib/enums';
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
  isClusterAdmin,
  isClusterMember,
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
  ctx,
}: {
  input: ClusterInput;
  ctx: ContextWithUser;
}) => {
  try {
    const clusterDetails = await readClusterById(input.clusterId);

    if (clusterDetails?.clustername !== input.clustername) {
      return { status: statusCodes.FAILURE };
    }

    const fetchedUsers = await readUsersOfCluster(input.clusterId);
    fetchedUsers.map((fetchedUser) => {
      const isMember = fetchedUser.member_of.some(
        ({ cluster_id }) => cluster_id === BigInt(input.clusterId),
      );

      // @ts-ignore
      delete fetchedUser.member_of;

      if (fetchedUser.username === ctx?.user?.username) {
        // @ts-ignore
        fetchedUser.isMe = true;
      }

      if (isMember) {
        // @ts-ignore
        return (fetchedUser.isAdmin = false);
      }

      // @ts-ignore
      return (fetchedUser.isAdmin = true);
    });

    const user = arrayOfArrayTransformer(fetchedUsers);
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

export const getClusterAssociation = async ({
  input,
  ctx,
}: {
  input: number;
  ctx: ContextWithUser;
}) => {
  try {
    const { user } = ctx;
    const isAdmin = await isClusterAdmin(user?.id, input);

    if (isAdmin) {
      return {
        status: statusCodes.SUCCESS,
        data: {
          association: clusterAssociations.IS_ADMIN,
        },
      };
    }

    const isMember = await isClusterMember(user?.id, input);

    if (isMember) {
      return {
        status: statusCodes.SUCCESS,
        data: {
          association: clusterAssociations.IS_MEMBER,
        },
      };
    }

    return {
      status: statusCodes.SUCCESS,
      data: {
        association: clusterAssociations.IS_FOREIGNER,
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
    // @ts-ignore
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
    const publicAppointments = await readPublicAppointments(input);
    const appointments = arrayOfArrayTransformer(publicAppointments);

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
    const publicClusters = await readPublicClusters(input);
    const clusters = arrayOfArrayTransformer(publicClusters);

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

function arrayOfArrayTransformer(arr: any[]) {
  const arrOfArr: any[][] = [];

  let page = 0;
  let singleArr: Cluster[] = [];
  arr.forEach((entry) => {
    if (singleArr.length === 10) {
      page++;
      entry.push(singleArr);
      singleArr = [];
    } else {
      singleArr.push(entry);
    }
  });

  if (!arrOfArr.length) {
    arrOfArr.push(singleArr);
  }

  return arrOfArr;
}
