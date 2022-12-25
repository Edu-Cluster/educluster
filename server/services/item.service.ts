import { prisma } from '../utils/prisma';

export const readClusterFromUser = async (username: string) => {
  let clusterUserList = await prisma.person
    .findUnique({ where: { username: username } })
    .admin_of({ select: { cluster_id: true } });
  clusterUserList = clusterUserList.concat(
    await prisma.person
      .findUnique({ where: { username: username } })
      .member_of({ select: { cluster_id: true } }),
  );

  let count = await prisma.cluster.aggregate({
    _count: { id: true },
  });

  let result = [];
  for (let i = 0; i * 5 < count._count.id; i++) {
    result[i] = await prisma.cluster.findMany({
      where: { id: { in: clusterUserList.map((obj) => obj.cluster_id) } },
      select: {
        id: true,
        clustername: true,
        description: true,
        person: { select: { username: true } },
      },
      orderBy: { clustername: 'asc' },
      skip: i * 5,
      take: i * 5 + 5,
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

  // let clusterUserList = await prisma.person
  //   .findUnique({ where: { username: username } })
  //   .admin_of({ select: { cluster_id: true } });
  // clusterUserList = clusterUserList.concat(
  //   await prisma.person
  //     .findUnique({ where: { username: username } })
  //     .member_of({ select: { cluster_id: true } }),
  // );

  let count = await prisma.cluster.aggregate({
    _count: { id: true },
  });

  let result = [];
  for (let i = 0; i * 5 < count._count.id; i++) {
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
        topics_for_appointment: {
          select: {
            topic_topicTotopics_for_appointment: {
              select: { symbol: true, is_visible: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
      skip: i * 5,
      take: i * 5 + 5,
    });
  }
  return result;
};
