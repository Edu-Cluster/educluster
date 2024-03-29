import type {
  person,
  cluster,
  appointment,
  notifications,
  room,
} from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export type User = person;

export type Member = {
  username: string;
  isAdmin: boolean;
  isMe?: boolean;
};

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: User | null;
};

export type Cluster = cluster;
export type Appointment = appointment;
export type Notifications = notifications;

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

export type RoomData = room & { conditionSatisfaction: number };
