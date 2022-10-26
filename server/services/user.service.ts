import customConfig from '../config/default';
import { signJwt } from '../utils/jwt';

// TODO Lara: Hier alle Methoden definieren, die auf die User-Tabelle zugreifen, und dann überall im Backend einfach importieren und nutzen

export const signTokens = async (username: string) => {
  // Create session and insert it into the database
  // TODO Lara

  // Create access and refresh tokens
  const access_token = signJwt({ sub: username }, 'accessTokenPrivateKey', {
    expiresIn: `${customConfig.accessTokenExpiresIn}m`,
  });

  const refresh_token = signJwt({ sub: username }, 'refreshTokenPrivateKey', {
    expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
  });

  // Return tokens
  return { access_token, refresh_token };
};
