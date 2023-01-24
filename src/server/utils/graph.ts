import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { DeviceCodeCredential } from '@azure/identity';

declare global {
  var graph: Client | undefined;
}

const credential = new DeviceCodeCredential({
  tenantId: '3a86959d-d033-4d9a-a110-d173a066351c',
  clientId: 'f7c7c0f0-1f3e-4444-b003-6e3c118178d0',
});
const authProvider = new TokenCredentialAuthenticationProvider(credential, {});

export const graph = Client.initWithMiddleware({
  debugLogging: true,
  authProvider,
});
