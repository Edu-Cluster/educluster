import { TRPCError } from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';

export type ContextWithUser = {
  req: NextApiRequest;
  res: NextApiResponse;
  user: Object | null; // TODO
};

/**
 * Middleware that deserialzes the user if a valid access token and session exist
 * and if a user associated with those credentials can be found.
 *
 * @param req
 * @param res
 */
export const deserializeUser = ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): ContextWithUser => {
  try {
    let access_token;

    // Get the access token
    if (
      // from ??? TODO
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      // from ??? TODO
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

    // Validate Access Token
    const decoded = verifyJwt(access_token, 'accessTokenPublicKey');

    // If no such access token could be decoded, return with empty user
    if (!decoded) {
      return notAuthenticated;
    }

    // Check if user has a valid session
    const session = ''; // TODO

    // If no valid session was found, return with empty user
    if (!session) {
      return notAuthenticated;
    }

    // Check if user still exist
    const user = { id: '' }; // TODO

    // If no user was found, return with empty user
    if (!user) {
      return notAuthenticated;
    }

    // If no error was encountered along the way, return with the user that was found
    return {
      req,
      res,
      user: { ...user, id: user.id },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};
