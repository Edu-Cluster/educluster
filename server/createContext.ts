import { NextApiRequest, NextApiResponse } from 'next';
import { deserializeUser } from './middleware/deserializeUser';

/**
 * Creates a context that processes and alters each request sent to the router.
 *
 * @param req
 * @param res
 */
export function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  // Add context middleware
  return deserializeUser({ req, res });
}

export type Context = ReturnType<typeof createContext>;
