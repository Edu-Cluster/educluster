import customConfig from '../config/default';
import { signJwt } from '../utils/jwt';

export const signTokens = async (user: any) => {
  // Type: Prisma.UserCreateInput
  // Create session and insert it into the database

  // Create access and refresh tokens
  const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: `${customConfig.accessTokenExpiresIn}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
  });

  // Return tokens
  return { access_token, refresh_token };
};
