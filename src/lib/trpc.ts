import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../server/routers/app.routes';

const trpc = createReactQueryHooks<AppRouter>();

export default trpc;
