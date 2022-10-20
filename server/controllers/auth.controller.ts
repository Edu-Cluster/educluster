import { TRPCError } from '@trpc/server';
import { OptionsType } from 'cookies-next/lib/types';
import { getCookie, setCookie } from 'cookies-next';
import { Context } from '../createContext';
import { LoginUserInput } from '../schemata/user.schema';
import { verifyJwt, signJwt } from '../utils/jwt';
import { signTokens } from '../services/user.service';
import customConfig from '../config/default';
import WebUntis from 'webuntis';
import { ContextWithUser } from '../../types';

// Options
const cookieOptions: OptionsType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const accessTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
  secure: process.env.NODE_ENV === 'production',
};

const refreshTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000,
  ),
};

/**
 * ?
 *
 * @param req
 * @param res
 */
export const refreshAccessTokenHandler = async ({
  ctx: { req, res },
}: {
  ctx: Context;
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

    // Check if the user has a valid session
    const session = ''; // TODO query for session with decoded.sub

    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user exist
    const user = { id: '' }; // TODO query database for username and password with JSON.parse(session).id

    if (!user) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${customConfig.accessTokenExpiresIn}m`,
    });

    // Send the access token as cookie
    setCookie('access_token', access_token, {
      req,
      res,
      ...accessTokenCookieOptions,
    });
    setCookie('logged_in', 'true', {
      req,
      res,
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    return {
      status: 'success',
      access_token,
    };
  } catch (err: any) {
    console.log(err);
    throw err;
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
  ctx: Context;
}) => {
  try {
    const { username, password } = input;

    // Check if we can find a user on the untis system with the provided credentials
    const untis = new WebUntis(
      customConfig.school,
      username,
      password,
      customConfig.schoolBaseUrl,
    );
    const loginResult = await untis.login();

    await untis.logout();

    return loginResult;
    // TODO remove the above once you have an idea how to proceed

    // Create the access token and refresh tokens
    const { access_token, refresh_token } = await signTokens({
      username,
      password,
    });

    // TODO Create session and insert it into the database

    // Send access token in cookie
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

    setCookie('logged_in', 'true', {
      req,
      res,
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send access token
    return {
      status: 'success',
      access_token,
    };
  } catch (err: any) {
    console.log(err);
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
    console.log(user);

    // TODO Delete session and credentials from database

    // Reset browser cookies
    setCookie('access_token', '', { req, res, maxAge: -1 });
    setCookie('refresh_token', '', { req, res, maxAge: -1 });
    setCookie('logged_in', '', { req, res, maxAge: -1 });

    return { status: 'success' };
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};
