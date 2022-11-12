import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';

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
    });
  }
};
