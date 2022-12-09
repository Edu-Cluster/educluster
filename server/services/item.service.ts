import { prisma } from '../utils/prisma';
import { Cluster, Item } from '../../lib/types';

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
        creator: true,
        person: { select: { username: true } },
      },
      orderBy: { clustername: 'asc' },
      skip: i * 5,
      take: i * 5 + 5,
    });
  }
  return result;
};

// export const readAppointmentsFromUser = async (untis_username: string) =>
//   await prisma.person
//     .findUnique({ where: { username: untis_username } })
//     .admin_of();
