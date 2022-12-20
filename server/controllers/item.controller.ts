import { TRPCError } from '@trpc/server';
import { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import {
  readAppointmentsFromUser,
  readClusterFromUser,
} from '../services/item.service';

/**
 * Returns the user object from the context.
 *
 * @param ctx
 */

export const getItemHandler = async ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const user = ctx.user;
    const cluster = await readClusterFromUser(user.username);
    const appointments = await readAppointmentsFromUser(user.username);
    return {
      status: statusCodes.SUCCESS,
      data: {
        appointments,
        cluster,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};