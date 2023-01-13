import { createRouter } from '../createRouter';
import { getMeHandler, getUsersHandler } from '../controllers/user.controller';
import * as trpc from '@trpc/server';
import { userSchema } from '../schemata/user.schema';

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Du musst eingeloggt sein um auf diese Ressource zuzugreifen!',
      });
    }
    return next();
  })
  .query('me', {
    resolve: ({ ctx }) => getMeHandler({ ctx }),
  })
  .query('users', {
    input: userSchema,
    resolve: ({ input }) => getUsersHandler({ input }),
  });
