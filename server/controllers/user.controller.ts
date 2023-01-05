import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import { UserSchema } from '../schemata/user.schema';
import { findUsersByEduClusterUsername } from '../services/user.service';

/**
 * Returns the user object from the context.
 *
 * @param ctx
 */
export const getMeHandler = ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const user = ctx.user;

    return {
      status: statusCodes.SUCCESS,
      data: {
        user,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};

export const getUsersHandler = async ({ input }: { input: UserSchema }) => {
  try {
    return {
      data: {
        users: await findUsersByEduClusterUsername(input),
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
