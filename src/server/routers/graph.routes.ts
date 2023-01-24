import { createRouter } from '../createRouter';
import { string } from 'zod';
import { orderChannelCreation } from '../controllers/graph.controller';
import axios, { AxiosRequestConfig } from 'axios';

export const graphRouter = createRouter()
  .middleware(async ({ next }) => {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `client_id=f7c7c0f0-1f3e-4444-b003-6e3c118178d0
              &client_secret=4yl8Q~Q8bJluD2hvXQLs9Jg.5tNd3WZUrO6C0drZ
              &scope=Team.ReadBasic.All
              &username=Educluster@htlpinkafeld.at
              &password=Pinka2022#
              &grant_type=password`,
      url: 'https://login.microsoftonline.com/3a86959d-d033-4d9a-a110-d173a066351c/oauth2/v2.0/token',
      method: 'post',
    };

    // TODO Denis:
    // https://www.tabnine.com/code/javascript/functions/%40microsoft%2Fmicrosoft-graph-client/Client/init <-- Graph Client so implementieren und access token mitgeben
    // https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth-ropc <-- Request zum Erlangen vom access token soll so gestaltet werden (nutzer Eduluster muss der Applikation hinzugefügt werden)
    // https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Owners/appId/f7c7c0f0-1f3e-4444-b003-6e3c118178d0/objectId/eda4f9ba-619a-43ee-a86d-1147745abe71/isMSAApp~/false/defaultBlade/Overview/appSignInAudience/AzureADMyOrg/servicePrincipalCreated~/true

    try {
      const res = await axios(config); // Send token request to receive access token
      console.log(`TOKEN: ${res?.data?.access_token}`);
    } catch (err: any) {
      console.error(err);
    }

    return next();
  })
  .mutation('createChannel', {
    input: string(),
    resolve: async ({ input, ctx }) =>
      await orderChannelCreation({ input, ctx }),
  });
