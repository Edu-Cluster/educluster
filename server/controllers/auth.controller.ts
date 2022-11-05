import { TRPCError } from '@trpc/server';
import { OptionsType } from 'cookies-next/lib/types';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { LoginUserInput, registerUserSchema } from '../schemata/user.schema';
import { verifyJwt, signJwt } from '../utils/jwt';
import {
  readEduClusterUsername,
  signTokens,
  teamsEmailAlreadyExists,
  writeTeamsEmailToUser,
} from '../services/user.service';
import customConfig from '../config/default';
import WebUntis from 'webuntis';
import type { ContextWithUser } from '../../lib/types';
import { statusCodes } from '../../lib/enums';

// Options
const cookieOptions: OptionsType = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

const accessTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000,
  ),
};

// TODO Denis: Throw more specific errors once failure cases can be tested

/**
 * Refreshes the access token.
 *
 * @param req
 * @param res
 */
export const refreshAccessTokenHandler = async ({
  ctx: { req, res },
}: {
  ctx: ContextWithUser;
}) => {
  try {
    // Get the refresh token from cookie
    const refresh_token = getCookie('refresh_token', { req, res }) as string;
    const message = 'Could not refresh access token!';

    if (!refresh_token) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey',
    );

    if (!decoded) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user with this session still exists
    const user = await readEduClusterUsername(decoded.sub); // TODO Lara: Nach user suchen in der Datenbank mit EduCluster username (decoded.sub)

    if (!user || user.untis_username !== decoded.sub) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Sign new access token
    const access_token = signJwt(
      { sub: user.username },
      'accessTokenPrivateKey',
      {
        expiresIn: `${customConfig.accessTokenExpiresIn}m`,
      },
    );

    // Send the access token as cookie
    setCookie('access_token', access_token, {
      req,
      res,
      ...accessTokenCookieOptions,
    });
    setCookie('session', 'true', {
      req,
      res,
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    return {
      status: statusCodes.SUCCESS,
      data: {
        access_token,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

/**
 * Handles the registration process.
 *
 * @param input
 */
export const registerHandler = async ({
  input,
}: {
  input: registerUserSchema;
}) => {
  try {
    const { email, password } = input;

    // Check if username doesn't exist in the database
    const user: number = await teamsEmailAlreadyExists(email);

    if (user) {
      // User with this username/email already exists in the database
      return { status: statusCodes.FAILURE };
    }

    // TODO Denis: Login in Teams mit email & password

    const username = ''; //TODO Denis: irgendwoher untis_username übergeben
    // User with this username/email doesn't exist, so update this user with the provided input
    await writeTeamsEmailToUser(username, email);

    return { status: statusCodes.SUCCESS };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

/**
 * Handles the login process.
 *
 * @param input
 * @param req
 * @param res
 */
export const loginHandler = async ({
  input,
  ctx: { req, res },
}: {
  input: LoginUserInput;
  ctx: ContextWithUser;
}) => {
  try {
    const { username, password, persistentCookie } = input;

    // Check if we can find a user on the untis system with the provided credentials
    const untis = new WebUntis(
      customConfig.school,
      username,
      password,
      customConfig.schoolBaseUrl,
    );

    try {
      // Attempt login, then logout
      await untis.login();
      await untis.logout();
    } catch (err: any) {
      return { status: statusCodes.FAILURE };
    }

    // Check if user with given untis username has MS Teams email address in the database
    const user = await readEduClusterUsername(username);
    if (!user?.teams_email) {
      // No such user in the database yet, so we will need more information
      return { status: statusCodes.TENTATIVE };
    }

    // User already exists -> create the access and refresh tokens
    const { access_token, refresh_token } = await signTokens(
      user.untis_username,
    );

    // Set browser cookies
    setCookie('access_token', access_token, {
      req,
      res,
      ...accessTokenCookieOptions,
    });
    setCookie('refresh_token', refresh_token, {
      req,
      res,
      ...refreshTokenCookieOptions,
    });
    setCookie('session', 'true', {
      req,
      res,
      ...cookieOptions,
      maxAge: persistentCookie ? 60 * 60 * 24 * 999 : undefined,
    });

    // Send access token
    return {
      status: statusCodes.SUCCESS,
      data: {
        access_token,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

/**
 * Handles the logout process.
 * Note: The logout process only concerns EduCluster and has no relation to the WebUntis logout process.
 *
 * @param ctx
 */
export const logoutHandler = async ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const { req, res, user } = ctx;

    // Reset browser cookies
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('session');

    return { status: statusCodes.SUCCESS };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};
