import { createRouter } from '../createRouter';
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from '../controllers/auth.controller';
import { loginUserSchema, registerUserSchema } from '../schemata/user.schema';

export const authRouter = createRouter()
  .mutation('register', {
    input: registerUserSchema,
    resolve: async ({ input }) => await registerHandler({ input }),
  })
  .mutation('login', {
    input: loginUserSchema,
    resolve: async ({ input, ctx }) => await loginHandler({ input, ctx }),
  })
  .mutation('logout', {
    resolve: () => logoutHandler(),
  })
  .query('refresh', {
    resolve: ({ ctx }) => refreshAccessTokenHandler({ ctx }),
  });
