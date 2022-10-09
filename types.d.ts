import {NextApiRequest, NextApiResponse} from "next";

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: User | null;
};

export type User = {
  id: number;
  name: string;
  password: string;
};
