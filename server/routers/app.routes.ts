import { createRouter } from '../createRouter';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { itemRouter } from './item.routes';

export const appRouter = createRouter()
  .query('test', {
    resolve: async () => {
      return { data: 'the test worked!' };
    },
  })
  .merge('auth.', authRouter)
  .merge('user.', userRouter)
  .merge('item.', itemRouter);

export type AppRouter = typeof appRouter;
