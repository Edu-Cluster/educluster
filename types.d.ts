import { NextApiRequest, NextApiResponse } from 'next';

export type User = {
  id: number;
  name: string;
};

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: User | null;
};

export type LearningUnit = {
  category: 1;
};

export type Cluster = {
  category: 0;
};

export type Item = {
  type: Cluster | LearningUnit;
  tags: string[] | null;
  title: string;
  description: string;
  host: string;
  room: string | null;
  link: string;
};
