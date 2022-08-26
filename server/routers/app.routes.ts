import { createRouter } from '../createRouter';
import { authRouter } from './auth.routes';

export const appRouter = createRouter()
  .query('test', {
    resolve: async (ctx) => {
      // deine main resolver
      return { test: 'test' };
    },
  })
  .merge('auth.', authRouter);
// merge other routes

export type AppRouter = typeof appRouter;
