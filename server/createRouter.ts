import { router } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './createContext';

export function createRouter() {
  return router<Context>()
    .transformer(superjson)
    .formatError(({ error, shape }) => {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        return {
          ...shape,
          message: 'Internal server error',
        };
      }
      return shape;
    });
}
