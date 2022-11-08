import customConfig from '../config/default';
import { signJwt } from '../utils/jwt';
import { prisma } from '../utils/prisma';

export const signTokens = async (username: string) => {
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

export const readEduClusterUsername = async (untis_username: string) =>
  await prisma.person.findUnique({
    where: {
      untis_username: untis_username,
    },
  });

export const teamsEmailAlreadyExists = async (teams_email: string) =>
  await prisma.person.count({
    where: {
      teams_email: teams_email,
    },
  });

export const writeTeamsEmailToUser = async (
  untis_username: string,
  email: string,
) => {
  await prisma.person.update({
    where: {
      untis_username: untis_username,
    },
    data: {
      teams_email: email,
    },
  });
};
