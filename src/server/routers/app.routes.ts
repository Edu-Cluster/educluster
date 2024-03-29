import { createRouter } from '../createRouter';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { itemRouter } from './item.routes';
import { catalogRouter } from './catalog.routes';
import { notificationRouter } from './notification.routes';

export const appRouter = createRouter()
  .query('test', {
    resolve: async () => {
      return { data: 'the test worked!' };
    },
  })
  .merge('auth.', authRouter)
  .merge('user.', userRouter)
  .merge('item.', itemRouter)
  .merge('catalog.', catalogRouter)
  .merge('notification.', notificationRouter);

export type AppRouter = typeof appRouter;
