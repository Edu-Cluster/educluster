import { TRPCError } from '@trpc/server';
import { Cluster, ContextWithUser } from '../../lib/types';
import {
  clusterAssociations,
  conditionSatisfactionTypes,
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
  getAllSpecificRooms,
  instantlyAddUser,
  createNewAppointment,
  readSpecificPublicAppointments,
  deleteOneAppointment,
  deleteOneCluster,
  deleteAllAppointments,
  deleteClusterAdmin,
  deleteClusterMember,
} from '../services/item.service';
import {
  ClusterInput,
  ClusterEditSchema,
  ClusterCreateSchema,
  UpdateMemberSchema,
} from '../schemata/cluster.schema';
import { findUserByEduClusterUsername } from '../services/user.service';
import { insertNewNotification } from '../services/notification.service';
import { isRoomAvailable } from '../services/untis.service';
import { SpecificRoomsSchema } from '../schemata/room.schema';
import {
  AppointmentAdvancedSearchSchema,
  AppointmentCreateSchema,
} from '../schemata/appointment.schema';
import { ClusterNotificationSchema } from '../schemata/notification.schema';

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
    const fetchedAppointments = await readAppointmentsOfCluster(input.id);
    const appointments = arrayOfArrayTransformer(fetchedAppointments);

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
  input: ClusterNotificationSchema;
  ctx: ContextWithUser;
}) => {
  try {
    const username = ctx?.user?.username || '';
    const cluster = await readClusterById(input.clusterId);

    for (const id of input.userIds) {
      await provisionallyInviteUser(id, input.clusterId);

      if (cluster) {
        await insertNewNotification(
          'Einladung',
          `Sie wurden zum Cluster "${cluster.clustername}#${cluster.id}" eingeladen!`,
          id,
          username,
        );
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
  invited,
}: {
  input: number;
  ctx: ContextWithUser;
  invited: boolean;
}) => {
  try {
    const id = ctx?.user?.id;

    if (!id) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    if (invited) {
      await officiallyInviteUser(id, input);
    } else {
      await instantlyAddUser(id, input);
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
      teamsId: `teams_${clustername}`,
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

export const createAppointment = async ({
  input,
  ctx,
}: {
  input: AppointmentCreateSchema;
  ctx: ContextWithUser;
}) => {
  try {
    const {
      name,
      description,
      timeFrom,
      timeTo,
      topics,
      date,
      roomname,
      clusterId,
    } = input;
    const creator = ctx?.user?.id;
    const teamsId = name;
    const untisId = name; // TODO Denis
    const dateFrom = new Date(date);
    const dateUntil = new Date(date);

    // Construct the appropriate from-date
    if (timeFrom.length === 3) {
      dateFrom.setHours(Number(timeFrom[0]));
      dateFrom.setMinutes(Number(timeFrom.slice(1, timeFrom.length)));
      dateFrom.setSeconds(0);
    } else {
      dateFrom.setHours(Number(timeFrom.slice(0, 2)));
      dateFrom.setMinutes(Number(timeFrom.slice(2, timeFrom.length)));
      dateFrom.setSeconds(0);
    }

    // Construct the appropriate to-date
    if (timeTo.length === 3) {
      dateUntil.setHours(Number(timeFrom[0]));
      dateUntil.setMinutes(Number(timeFrom.slice(1, timeFrom.length)));
      dateUntil.setSeconds(0);
    } else {
      dateUntil.setHours(Number(timeFrom.slice(0, 2)));
      dateUntil.setMinutes(Number(timeFrom.slice(2, timeFrom.length)));
      dateUntil.setSeconds(0);
    }

    const newAppointment = await createNewAppointment({
      teamsId,
      untisId,
      name,
      description,
      roomname,
      topics,
      creator,
      clusterId,
      dateFrom,
      dateUntil,
    });

    return {
      data: {
        id: newAppointment && newAppointment.id,
        name: newAppointment && newAppointment.name,
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

export const getSpecificPublicAppointments = async ({
  input,
}: {
  input: AppointmentAdvancedSearchSchema;
}) => {
  try {
    const fullDateFrom = input.dateFrom ? new Date(input.dateFrom) : null;
    const fullDateTo = input.dateTo ? new Date(input.dateTo) : null;

    if (fullDateFrom && input.timeFrom) {
      if (input.timeFrom.length === 3) {
        fullDateFrom.setHours(Number(input.timeFrom[0]));
        fullDateFrom.setMinutes(
          Number(input.timeFrom.slice(1, input.timeFrom.length)),
        );
        fullDateFrom.setSeconds(0);
      } else {
        fullDateFrom.setHours(Number(input.timeFrom.slice(0, 2)));
        fullDateFrom.setMinutes(
          Number(input.timeFrom.slice(3, input.timeFrom.length)),
        );
        fullDateFrom.setSeconds(0);
      }
    }

    if (fullDateTo && input.timeTo) {
      if (input.timeTo.length === 3) {
        fullDateTo.setHours(Number(input.timeTo[0]));
        fullDateTo.setMinutes(
          Number(input.timeTo.slice(1, input.timeTo.length)),
        );
        fullDateTo.setSeconds(0);
      } else {
        fullDateTo.setHours(Number(input.timeTo.slice(0, 2)));
        fullDateTo.setMinutes(
          Number(input.timeTo.slice(3, input.timeTo.length)),
        );
        fullDateTo.setSeconds(0);
      }
    }

    const publicAppointments = await readSpecificPublicAppointments(
      input.name,
      fullDateFrom,
      fullDateTo,
      input.topics,
      input.subject,
    );
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

export const getSpecificRooms = async ({
  input,
}: {
  input: SpecificRoomsSchema;
}) => {
  const availabilityMap = new Map();

  try {
    const allSpecificRooms = await getAllSpecificRooms(
      input.sizeMin,
      input.sizeMax,
      input.equipment,
    );

    if (!allSpecificRooms || !allSpecificRooms.length) {
      return {
        status: statusCodes.FAILURE,
        data: {
          rooms: [],
        },
      };
    }

    // Get available rooms by checking if the rooms are booked within the given range or not
    for (let i = allSpecificRooms.length - 1; i >= 0; i--) {
      const availability = await isRoomAvailable(
        Number(allSpecificRooms[i].untis_id),
        input.from,
        input.to,
      );

      if (Array.isArray(availability)) {
        availabilityMap.set(allSpecificRooms[i].untis_id, availability);
        // @ts-ignore
        allSpecificRooms[i].conditionSatisfaction =
          conditionSatisfactionTypes.SEMISATISFIED;
      } else {
        if (availability) {
          // @ts-ignore
          allSpecificRooms[i].conditionSatisfaction =
            conditionSatisfactionTypes.SATISFIED;
        } else {
          // @ts-ignore
          allSpecificRooms[i].conditionSatisfaction =
            conditionSatisfactionTypes.UNSATISFIED;
        }
      }
    }

    // Sort rooms by condition satisfaction
    allSpecificRooms.sort((a, b) =>
      // @ts-ignore
      a.conditionSatisfaction > b.conditionSatisfaction
        ? 1
        : // @ts-ignore
        b.conditionSatisfaction > a.conditionSatisfaction
        ? -1
        : 0,
    );

    const rooms = arrayOfArrayTransformer(allSpecificRooms);

    return {
      status: statusCodes.SUCCESS,
      data: {
        rooms,
        availabilities: availabilityMap || null,
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

export const deleteAppointment = async ({ input }: { input: bigint }) => {
  try {
    await deleteOneAppointment(input);

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

export const deleteCluster = async ({ input }: { input: bigint }) => {
  try {
    const appointments = await readAppointmentsOfCluster(input);
    const appointmentIds = appointments.map((appointment) => appointment.id);

    await deleteAllAppointments(appointmentIds);
    await deleteClusterAdmin(input);
    await deleteClusterMember(input);
    await deleteOneCluster(input);

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

function arrayOfArrayTransformer(arr: any[]) {
  const arrOfArr: any[][] = [];

  let page = 0;
  let singleArr: Cluster[] = [];
  arr.forEach((entry) => {
    if (singleArr.length === 10) {
      page++;
      arrOfArr.push(singleArr);
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
