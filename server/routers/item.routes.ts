import { createRouter } from '../createRouter';
import { getItemHandler } from '../controllers/item.controller';

export const itemRouter = createRouter().query('mine', {
  resolve: async ({ ctx }) => await getItemHandler({ ctx }),
});
