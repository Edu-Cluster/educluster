import { NextApiRequest, NextApiResponse } from 'next';
import { roles } from './enums';

export type User = {
  id: number;
  username: string;
  untis_username: string;
  teams_email: string;
  role: string;
};

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: person | null;
};

export type Member = {
  username: string;
  role: roles.ADMINISTRATOR | roles.STUDENT | roles.TEACHER;
};

export type Cluster = {
  id: number;
  clustername: string;
  description: string;
  person: { username: string };
};

export type Appointment = {
  id: number;
  topics_for_appointment: {
    topic_topicTotopics_for_appointment: {
      symbol: string;
      is_visible: boolean;
    } | null;
  }[];
  name: string;
  description: string;
  creator: string;
  roomname: string | null;
  link: string;
};
