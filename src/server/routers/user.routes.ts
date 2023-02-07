import { createRouter } from '../createRouter';
import {
  getMeHandler,
  getUsersHandler,
  updateUsername,
} from '../controllers/user.controller';
import * as trpc from '@trpc/server';
import { userSchema } from '../schemata/user.schema';
import { string } from 'zod';

export const userRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new trpc.TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'Sie müssen eingeloggt sein um auf diese Ressource zuzugreifen!',
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
  })
  .mutation('updateUsername', {
    input: string(),
    resolve: ({ input, ctx }) => updateUsername({ input, ctx }),
  });
