// @ts-nocheck
import { prisma } from '../utils/prisma';

const maxCountForPage = 5;
export const readClusterFromUser = async (username: string) => {
  let clusterUserAdminList = await prisma.person.findUnique({
    where: { username: username },
    select: { admin_of: { select: { cluster_id: true } } },
  });

  let clusterUserMemberList = await prisma.person.findUnique({
    where: { username: username },
    select: { member_of: { select: { cluster_id: true } } },
  });
  let clusterUserList = clusterUserAdminList?.admin_of.map(
    (obj) => obj.cluster_id,
  );
  clusterUserList = clusterUserList?.concat(
    // @ts-ignore
    clusterUserMemberList?.member_of.map((obj) => obj.cluster_id),
  );

  let count = await prisma.cluster.aggregate({
    _count: { id: true },
  });

  let result = [];
  for (let i = 0; i * maxCountForPage < count._count.id; i++) {
    result[i] = await prisma.cluster.findMany({
      where: { id: { in: clusterUserList } },
      select: {
        id: true,
        clustername: true,
        description: true,
        person: { select: { username: true } },
      },
      orderBy: { clustername: 'asc' },
      skip: i * maxCountForPage,
      take: i * maxCountForPage + maxCountForPage,
    });
  }
  return result;
};

export const readAppointmentsFromUser = async (username: string) => {
  let clusterUserAdminList = await prisma.person.findUnique({
    where: { username: username },
    select: { admin_of: { select: { cluster_id: true } } },
  });

  let clusterUserMemberList = await prisma.person.findUnique({
    where: { username: username },
    select: { member_of: { select: { cluster_id: true } } },
  });
  let clusterUserList = clusterUserAdminList?.admin_of.map(
    (obj) => obj.cluster_id,
  );
  clusterUserList = clusterUserList?.concat(
    // @ts-ignore
    clusterUserMemberList?.member_of.map((obj) => obj.cluster_id),
  );

  let count = await prisma.cluster.aggregate({
    _count: { id: true },
  });

  let result = [];
  for (let i = 0; i * maxCountForPage < count._count.id; i++) {
    result[i] = await prisma.appointment.findMany({
      where: {
        id: { in: clusterUserList },
      },
      select: {
        description: true,
        id: true,
        name: true,
        person: { select: { username: true } },
        roomname: true,
        date_from: true,
        date_until: true,
        topics_for_appointment: {
          select: {
            topic_topicTotopics_for_appointment: {
              select: { symbol: true, is_visible: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
      skip: i * maxCountForPage,
      take: i * maxCountForPage + maxCountForPage,
    });
  }
  return result;
};

export const readPublicAppointments = async (name?: string) => {
  if (name && name !== '') {
    return await prisma.appointment.findMany({
      where: {
        cluster_appointmentTocluster: {
          is_private: false,
        },
        name: { startsWith: name },
      },
      include: { person: true },
    });
  }

  return await prisma.appointment.findMany({
    where: {
      cluster_appointmentTocluster: {
        is_private: false,
      },
    },
    include: {
      person: true,
      topics_for_appointment: {
        include: {
          topic_topicTotopics_for_appointment: true,
        },
      },
    },
  });
};

export const readSpecificPublicAppointments = async (
  name: string | null,
  dateFrom: Date | null,
  dateTo: Date | null,
  topics: string[] | null,
  subjects: string[] | null,
) => {
  return await prisma.appointment.findMany({
    where: {
      cluster_appointmentTocluster: {
        is_private: false,
      },
      topics_for_appointment: {
        ...(topics ? { every: { topic: { in: topics } } } : {}),
        ...(subjects
          ? {
              every: {
                topic_topicTotopics_for_appointment: {
                  subject: { in: subjects },
                },
              },
            }
          : {}),
      },
      ...(dateFrom
        ? {
            date_from: {
              gte: dateFrom,
            },
          }
        : {}),
      ...(dateTo
        ? {
            date_until: {
              lte: dateTo,
            },
          }
        : {}),
      ...(name ? { name: { startsWith: name } } : {}),
    },
    include: {
      person: true,
      topics_for_appointment: {
        include: {
          topic_topicTotopics_for_appointment: true,
        },
      },
    },
  });
};

export const readClusterById = async (clusterid: number | bigint) =>
  await prisma.cluster.findUnique({
    where: { id: clusterid },
    include: { person: true },
  });

export const readAppointmentById = async (appointmentid: number | bigint) =>
  await prisma.appointment.findUnique({
    where: { id: appointmentid },
    include: { cluster_appointmentTocluster: true, person: true },
  });

export const readClusterByClustername = async (clustername: string) =>
  await prisma.cluster.findUnique({ where: { clustername } });

export const readPublicClusters = async (clustername?: string) => {
  if (clustername && clustername !== '') {
    return await prisma.cluster.findMany({
      where: {
        is_private: false,
        clustername: { startsWith: clustername },
      },
      include: { person: true },
    });
  }

  return await prisma.cluster.findMany({
    where: { is_private: false },
    include: { person: true },
  });
};

export const updateClusterById = async (
  clusterid: number | bigint,
  clustername: string,
  description: string,
  isPrivate: boolean,
) => {
  clustername = clustername || undefined;
  description = description || undefined;

  await prisma.cluster.update({
    where: { id: clusterid },
    data: { clustername, description, is_private: isPrivate },
  });
};

export const createNewCluster = async ({
  creator,
  clustername,
  description,
  isPrivate,
  teamsId,
}) =>
  await prisma.cluster.create({
    data: {
      creator,
      clustername,
      description,
      is_private: isPrivate,
      teams_id: teamsId,
      channel_id: `${teamsId}_channel`,
    },
  });

export const createNewAppointment = async ({
  teamsId,
  untisId,
  name,
  description,
  dateFrom,
  dateUntil,
  roomname,
  topics,
  clusterId,
  creator,
}) => {
  await prisma.appointment.create({
    data: {
      name,
      description,
      creator,
      cluster: clusterId,
      roomname: roomname === null ? undefined : roomname,
      teams_id: teamsId,
      untis_id: untisId,
      date_from: dateFrom,
      date_until: dateUntil,
    },
  });

  const newAppointment = await prisma.appointment.findFirst({
    where: { name },
    select: { id: true, name: true },
  });
  for (const item of topics) {
    await prisma.topics_for_appointment.create({
      data: {
        appointment: newAppointment.id,
        topic: item,
      },
    });
  }

  return newAppointment;
};

export const addNewClusterAdmin = async (
  personId: number | bigint | undefined,
  clusterId: number | bigint | undefined,
) =>
  await prisma.admin_of.create({
    data: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });

export const readAppointmentsOfCluster = async (clusterid: number | bigint) =>
  await prisma.appointment.findMany({
    where: {
      cluster: clusterid,
    },
    select: {
      description: true,
      id: true,
      name: true,
      person: { select: { username: true } },
      roomname: true,
      date_from: true,
      date_until: true,
      topics_for_appointment: {
        select: {
          topic_topicTotopics_for_appointment: {
            select: { symbol: true, is_visible: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

export const readTagsOfAppointment = async (appointmentid: number) =>
  await prisma.topics_for_appointment.findMany({
    where: { appointment: appointmentid },
  });

export const readUsersOfCluster = async (clusterid: number | bigint) =>
  await prisma.person.findMany({
    where: {
      OR: [
        {
          admin_of: {
            some: {
              cluster_id: clusterid,
            },
          },
        },
        {
          member_of: {
            some: {
              cluster_id: clusterid,
              is_active: true,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      teams_email: true,
      is_sysadmin: true,
      member_of: {
        select: {
          cluster_id: true,
        },
      },
    },
  });

export const isClusterAdmin = async (
  personId: number | bigint | undefined,
  clusterId: number,
) =>
  await prisma.admin_of.findFirst({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });

export const isClusterMember = async (
  personId: number | bigint | undefined,
  clusterId: number,
) =>
  await prisma.member_of.findFirst({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });

export const provisionallyInviteUser = async (
  person_id: number | bigint,
  cluster_id: number | bigint,
) =>
  prisma.member_of.create({
    data: {
      person_id,
      cluster_id,
      is_active: false,
    },
  });

export const officiallyInviteUser = (
  person_id: number | bigint,
  cluster_id: number | bigint,
) =>
  prisma.member_of.updateMany({
    data: {
      is_active: true,
    },
    where: {
      person_id,
      cluster_id,
    },
  });

export const instantlyAddUser = (
  person_id: number | bigint,
  cluster_id: number | bigint,
) =>
  prisma.member_of.create({
    data: {
      person_id,
      cluster_id,
      is_active: true,
    },
  });

export const transformMemberToAdmin = async (
  personId: number | bigint,
  clusterId: number,
) => {
  await prisma.member_of.deleteMany({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });
  await prisma.admin_of.create({
    data: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });
};

export const transformAdminToMember = async (
  personId: number | bigint,
  clusterId: number,
) => {
  await prisma.admin_of.deleteMany({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });
  await prisma.member_of.create({
    data: {
      person_id: personId,
      cluster_id: clusterId,
      is_active: true,
    },
  });
};

export const deleteMember = async (
  personId: number | bigint,
  clusterId: number,
) =>
  await prisma.member_of.deleteMany({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });

export const deleteClusterMember = async (clusterId: number | bigint) =>
  await prisma.member_of.deleteMany({
    where: {
      cluster_id: clusterId,
    },
  });

export const deleteAdmin = async (
  personId: number | bigint,
  clusterId: number,
) =>
  await prisma.admin_of.deleteMany({
    where: {
      person_id: personId,
      cluster_id: clusterId,
    },
  });

export const deleteClusterAdmin = async (clusterId: number | bigint) =>
  await prisma.admin_of.deleteMany({
    where: {
      cluster_id: clusterId,
    },
  });

export const getAllSpecificRooms = async (
  sizeMin?: number,
  sizeMax?: number,
  equipment?: string,
) => {
  if (sizeMin && sizeMax && equipment) {
    return await prisma.room.findMany({
      where: {
        AND: [
          {
            seats: {
              gte: sizeMin,
              lte: sizeMax,
            },
          },
          {
            equipment_for_room: {
              every: {
                equipment,
              },
            },
          },
        ],
      },
    });
  } else if (sizeMin && sizeMax) {
    return await prisma.room.findMany({
      where: {
        seats: {
          gte: sizeMin,
          lte: sizeMax,
        },
      },
    });
  } else if (equipment) {
    return await prisma.room.findMany({
      where: {
        equipment_for_room: {
          every: {
            equipment,
          },
        },
      },
    });
  } else {
    return await getAllRooms();
  }
};

export const getAllRooms = async (name?: string) => {
  if (name) {
    return await prisma.room.findMany({
      where: {
        name: { startsWith: name },
      },
    });
  }

  return await prisma.room.findMany();
};

export const deleteOneAppointment = async (id: bigint) => {
  await prisma.topics_for_appointment.deleteMany({
    where: {
      appointment: id,
    },
  });

  await prisma.appointment.delete({
    where: {
      id,
    },
  });
};

export const deleteAllAppointments = async (ids: bigint[]) => {
  for (let id in ids) {
    await prisma.topics_for_appointment.deleteMany({
      where: {
        appointment: id,
      },
    });

    await prisma.appointment.delete({
      where: {
        id,
      },
    });
  }
};

export const deleteOneCluster = async (id: bigint) =>
  await prisma.cluster.delete({
    where: {
      id,
    },
  });
