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

export const readClusternameOfCluster = async (clusterid: Number | undefined) =>
  await prisma.cluster.findUnique({ where: { id: clusterid } });

export const readAppointmentsOfCluster = async (
  clusterid: Number | undefined,
) => {
  let count = await prisma.appointment.aggregate({
    where: {
      cluster: clusterid,
    },
    _count: { id: true },
  });
  let result = [];
  for (let i = 0; i * maxCountForPage < count._count.id; i++) {
    result[i] = await prisma.appointment.findMany({
      where: {
        id: clusterid,
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
      skip: i * maxCountForPage,
      take: i * maxCountForPage + maxCountForPage,
    });
  }
  return result;
};

export const readUsersOfCluster = async (clusterid: Number | undefined) => {
  let useridadmin = await prisma.admin_of.findMany({
    where: { cluster_id: clusterid },
    select: { person_id: true },
  });
  let useridmember = await prisma.member_of.findMany({
    where: { cluster_id: clusterid },
    select: { person_id: true },
  });
  let count = await prisma.person.aggregate({
    where: {
      OR: [
        { id: { in: useridadmin.map((obj) => obj.person_id) } },
        { id: { in: useridmember.map((obj) => obj.person_id) } },
      ],
    },
    _count: { id: true },
  });
  let result = [];
  for (let i = 0; i * maxCountForPage < count._count.id; i++) {
    result[i] = await prisma.person.findMany({
      where: {
        OR: [
          { admin_of: { some: { cluster_id: clusterid } } },
          { member_of: { some: { cluster_id: clusterid } } },
        ],
      },
      select: {
        username: true,
        admin_of: {
          select: { person_id: true },
          where: { cluster_id: clusterid },
        },
        member_of: {
          select: { person_id: true },
          where: { cluster_id: clusterid },
        },
      },
      skip: i * maxCountForPage,
      take: i * maxCountForPage + maxCountForPage,
    });
  }
  return result;
};
