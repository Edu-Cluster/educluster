import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import { UserSchema } from '../schemata/user.schema';
import {
  findUserByEduClusterUsername,
  findUsersByEduClusterUsername,
  updateUserUsername,
} from '../services/user.service';

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
    const users = await findUsersByEduClusterUsername(
      input.username,
      input.clusterId,
    );

    return {
      data: {
        users,
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

export const updateUsername = async ({
  input,
  ctx,
}: {
  input: string;
  ctx: ContextWithUser;
}) => {
  try {
    const username = ctx?.user?.username || '';

    const alreadyTaken = await findUserByEduClusterUsername(input);

    if (alreadyTaken) {
      return {
        status: statusCodes.FAILURE,
      };
    }

    await updateUserUsername(username, input);

    return {
      status: statusCodes.SUCCESS,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
