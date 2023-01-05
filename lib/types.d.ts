import type { person, cluster, appointment } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export type User = person;

export type Member = {
  username: string;
  admin_of: { length: number };
  member_of: { length: number };
};

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: User | null;
};

export type Cluster = cluster;
export type Appointment = appointment;

export type ClusterData = Cluster & {
  person: { username: string };
};

export type AppointmentData = Appointment & {
  topics_for_appointment: {
    topic_topicTotopics_for_appointment: {
      symbol: string;
      is_visible: boolean;
    } | null;
  }[];
  person: { username: string };
  name: string;
  description: string;
  roomname: string | null;
  link: string;
};
