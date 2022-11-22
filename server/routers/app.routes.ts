import { createRouter } from '../createRouter';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';

export const appRouter = createRouter()
  .query('test', {
    resolve: async () => {
      return { data: 'the test worked!' };
    },
  })
  .merge('auth.', authRouter)
  .merge('user.', userRouter);

export type AppRouter = typeof appRouter;
