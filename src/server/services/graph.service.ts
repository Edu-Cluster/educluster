import { graph } from '../utils/graph';

export const createChannel = async () => {
  return await graph
    .api(`/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')`)
    .get();
};
