import { TRPCError } from '@trpc/server';
import { Cluster, ContextWithUser } from '../../lib/types';
import {
  clusterAssociations,
  notificationTypes,
  statusCodes,
} from '../../lib/enums';
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
  transformMemberToAdmin,
  transformAdminToMember,
  deleteMember,
  deleteAdmin,
  officiallyInviteUser,
  readAppointmentById,
  readTagsOfAppointment,
} from '../services/item.service';
import {
  ClusterInput,
  ClusterEditSchema,
  ClusterCreateSchema,
  UpdateMemberSchema,
  ClusterInvitationSchema,
} from '../schemata/cluster.schema';
import { findUserByEduClusterUsername } from '../services/user.service';
import { insertNewNotification } from '../services/notification.service';

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
    const clusterDetails = await readClusterById(input.id);

    if (!clusterDetails || clusterDetails?.clustername !== input.name) {
      return { status: statusCodes.FAILURE };
    }

    const fetchedUsers = await readUsersOfCluster(input.id);
    fetchedUsers.map((fetchedUser) => {
      const isMember = fetchedUser.member_of.some(
        ({ cluster_id }) => cluster_id === BigInt(input.id),
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
    const appointments = await readAppointmentsOfCluster(input.id);

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

export const getItemOfAppointmentHandler = async ({
  input,
  ctx,
}: {
  input: ClusterInput;
  ctx: ContextWithUser;
}) => {
  try {
    const appointmentDetails = await readAppointmentById(input.id);

    if (!appointmentDetails || appointmentDetails?.name !== input.name) {
      return { status: statusCodes.FAILURE };
    }

    const fetchedUsers = await readUsersOfCluster(appointmentDetails.cluster!);
    fetchedUsers.map((fetchedUser) => {
      const isMember = fetchedUser.member_of.some(
        ({ cluster_id }) => cluster_id === BigInt(input.id),
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
    const tags = await readTagsOfAppointment(input.id);

    return {
      status: statusCodes.SUCCESS,
      data: {
        user,
        tags,
        appointmentDetails,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const getMembersOfCluster = async ({
  input,
  ctx,
}: {
  input: number;
  ctx: ContextWithUser;
}) => {
  try {
    const fetchedMembers = await readUsersOfCluster(input);
    fetchedMembers.map((fetchedMember) => {
      const isMember = fetchedMember.member_of.some(
        ({ cluster_id }) => cluster_id === BigInt(input),
      );

      // @ts-ignore
      delete fetchedMember.member_of;

      if (fetchedMember.username === ctx?.user?.username) {
        // @ts-ignore
        fetchedMember.isMe = true;
      }

      if (isMember) {
        // @ts-ignore
        return (fetchedMember.isAdmin = false);
      }

      // @ts-ignore
      return (fetchedMember.isAdmin = true);
    });

    const members = arrayOfArrayTransformer(fetchedMembers);

    if (members) {
      return {
        status: statusCodes.SUCCESS,
        data: {
          members,
        },
      };
    }

    return {
      status: statusCodes.FAILURE,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export const updateMemberOfCluster = async ({
  input,
}: {
  input: UpdateMemberSchema;
}) => {
  try {
    const user = await findUserByEduClusterUsername(input.username);

    if (!user) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    const personId = user.id;

    if (input.type === clusterAssociations.IS_ADMIN) {
      await transformMemberToAdmin(personId, input.clusterId);
    } else if (input.type === clusterAssociations.IS_MEMBER) {
      await transformAdminToMember(personId, input.clusterId);
    }

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

export const removeMemberFromCluster = async ({
  input,
}: {
  input: UpdateMemberSchema;
}) => {
  try {
    const user = await findUserByEduClusterUsername(input.username);

    if (!user) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    const personId = user.id;

    if (input.type === clusterAssociations.IS_MEMBER) {
      await deleteMember(personId, input.clusterId);
    } else if (input.type === clusterAssociations.IS_ADMIN) {
      await deleteAdmin(personId, input.clusterId);
    }

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
  input: ClusterInvitationSchema;
  ctx: ContextWithUser;
}) => {
  try {
    const username = ctx?.user?.username || '';
    const cluster = await readClusterById(input.clusterId);

    if (!cluster) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    for (const id of input.userIds) {
      await provisionallyInviteUser(id, input.clusterId);

      if (input.type === notificationTypes.INVITATION) {
        await insertNewNotification(
          'Einladung',
          `Sie wurden zum Cluster "${cluster.clustername}#${cluster.id}" eingeladen!`,
          id,
          username,
        );
      } else if (input.type === notificationTypes.WARNING) {
        // TODO Denis
      }
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

export const addMemberToCluster = async ({
  input,
  ctx,
}: {
  input: number;
  ctx: ContextWithUser;
}) => {
  try {
    const id = ctx?.user?.id;

    if (!id) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    await officiallyInviteUser(id, input);

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
