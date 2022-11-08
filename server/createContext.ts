import { NextApiRequest, NextApiResponse } from 'next';
import { deserializeUser } from './middleware/deserializeUser';

/**
 * Creates a context that processes and alters each request sent to the router.
 *
 * @param req
 * @param res
 */
export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  // Add context middleware
  return await deserializeUser({ req, res });
}
