import { prisma } from '../utils/prisma';
import { Item } from '../../lib/types';

export const readClusterFromUser = async (username: string) => {
  return [
    [
      {
        type: { category: 0 },
        tags: null,
        title: 'Ein Cluster',
        description: 'Mein erster Cluster',
        host: 'Mr. Admin',
        room: null,
        link: '/',
      },
    ],
  ];

  var clusterUserList = await prisma.person
    .findUnique({ where: { username: username } })
    .admin_of({ select: { cluster_id: true } });
  clusterUserList = clusterUserList.concat(
    await prisma.person
      .findUnique({ where: { username: username } })
      .member_of({ select: { cluster_id: true } }),
  );

  var clusterSelect = await prisma.cluster.findMany({
    where: { id: { in: clusterUserList.map((obj) => obj.cluster_id) } },
    select: {
      clustername: true,
      description: true,
      creator: true,
    },
  });

  var cluster = Object.fromEntries(
    Object.entries(clusterSelect).map(([key, value]) => [
      key,
      {
        type: { category: 0 },
        tags: null,
        title: value.clustername,
        description: value.description,
        host: value.creator,
        room: null,
        link: '/',
      },
    ]),
  );
  return splitArrayToMultidimensionalArray(cluster, 5) as Item[][];
};

// export const readAppointmentsFromUser = async (untis_username: string) =>
//   await prisma.person
//     .findUnique({ where: { username: untis_username } })
//     .admin_of();

const splitArrayToMultidimensionalArray = (items: any, width: number) => {
  var result: Object[][] = new Array<Array<Object>>(10);
  var row = 0;
  for (
    var index = 0;
    index < Object.keys(items).length;
    index = index + width
  ) {
    result[row] = Object.entries(items).slice(index, index + width);
    row++;
  }
  return result;
};
