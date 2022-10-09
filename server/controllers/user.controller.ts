import { TRPCError } from '@trpc/server';
import {ContextWithUser} from "../../types";

export const getMeHandler = ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const user = ctx.user;

    return {
      status: 'success',
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
