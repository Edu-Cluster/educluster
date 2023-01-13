import { TRPCError } from '@trpc/server';
import { statusCodes } from '../../lib/enums';
import { readTeachingTimes } from '../services/catalog.service';

/** TODO Lara
 * Returns the user object from the context.
 *
 * @param ctx
 */

export const getTeachingTimes = async ({}: {}) => {
  try {
    const times = await readTeachingTimes();
    return {
      status: statusCodes.SUCCESS,
      data: {
        times,
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
