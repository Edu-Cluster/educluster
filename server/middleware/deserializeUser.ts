import { TRPCError } from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';
import { ContextWithUser } from '../../lib/types';
import { readEduClusterUsername } from '../services/user.service';

/**
 * Deserializes the user if a valid access token and session exist and if a user associated with those credentials can be found.
 *
 * @param req
 * @param res
 */
export const deserializeUser = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<ContextWithUser> => {
  try {
    const { authorization } = req.headers;
    let access_token;

    // Get the access token
    if (authorization && authorization.startsWith('Bearer')) {
      access_token = authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    const notAuthenticated = {
      req,
      res,
      user: null,
    };

    // If there is no access token, return with empty user
    if (!access_token) {
      return notAuthenticated;
    }

    // Validate access token
    const decoded = verifyJwt<{ sub: string }>(
      access_token,
      'accessTokenPublicKey',
    );

    // If no such access token could be decoded, return with empty user
    if (!decoded) {
      return notAuthenticated;
    }

    // Check if user still exists in the database
    const user = await readEduClusterUsername(decoded.sub);

    // If no user was found, return with empty user
    if (!user) {
      return notAuthenticated;
    }

    // If no error was encountered along the way, return with the user that was found
    return {
      req,
      res,
      user,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};
