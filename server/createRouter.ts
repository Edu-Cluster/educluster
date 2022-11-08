import { router } from '@trpc/server';
import superjson from 'superjson';
import { ContextWithUser } from '../lib/types';

export function createRouter() {
  return router<ContextWithUser>()
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
