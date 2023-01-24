import { ContextWithUser } from '../../lib/types';
import { TRPCError } from '@trpc/server';
import { createChannel } from '../services/graph.service';
import { statusCodes } from '../../lib/enums';

export const orderChannelCreation = async ({
  input,
  ctx,
}: {
  input: string;
  ctx: ContextWithUser;
}) => {
  try {
    const { user } = ctx;
    const result = await createChannel();
    console.log(result);

    if (result) {
      return {
        status: statusCodes.SUCCESS,
      };
    }

    return {
      status: statusCodes.FAILURE,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
