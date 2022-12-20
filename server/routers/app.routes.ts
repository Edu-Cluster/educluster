import { createRouter } from '../createRouter';
import { authRouter } from './auth.routes';
import { userRouter } from './user.routes';
import { clusterRouter } from './cluster.routes';
import { appointmentRouter } from './appointment.routes';

export const appRouter = createRouter()
  .query('test', {
    resolve: async () => {
      return { data: 'the test worked!' };
    },
  })
  .merge('auth.', authRouter)
  .merge('user.', userRouter)
  .merge('cluster.', clusterRouter)
  .merge('appointment.', clusterRouter);

export type AppRouter = typeof appRouter;
