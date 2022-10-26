import { createRouter } from '../createRouter';
import { getMeHandler } from '../controllers/user.controller';
import * as trpc from '@trpc/server';

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource!',
      });
    }
    return next();
  })
  .query('me', {
    resolve: ({ ctx }) => getMeHandler({ ctx }),
  });
