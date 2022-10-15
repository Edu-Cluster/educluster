import { createRouter } from '../createRouter';
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';
import { loginUserSchema } from '../schemata/user.schema';

export const authRouter = createRouter()
  .mutation('login', {
    input: loginUserSchema,
    resolve: async ({ input, ctx }) => await loginHandler({ input, ctx }),
  })
  .mutation('logout', {
    resolve: ({ ctx }) => logoutHandler({ ctx }),
  })
  .query('refresh', {
    resolve: ({ ctx }) => refreshAccessTokenHandler({ ctx }),
  });
