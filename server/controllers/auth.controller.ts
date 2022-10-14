import { TRPCError } from '@trpc/server';
import { OptionsType } from 'cookies-next/lib/types';
import { getCookie, setCookie } from 'cookies-next';
import customConfig from '../config/default';
import { Context } from '../createContext';
import { LoginUserInput } from '../schema/user.schema';
import { verifyJwt, signJwt } from '../utils/jwt';
import WebUntis from 'webuntis';
import { ContextWithUser } from '../middleware/deserializeUser';

const cookieOptions: OptionsType = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// Cookie options
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

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const refreshAccessTokenHandler = async ({
  ctx: { req, res },
}: {
  ctx: Context;
}) => {
  try {
    // Get the refresh token from cookie
    const refresh_token = getCookie('refresh_token', { req, res }) as string;

    const message = 'Could not refresh access token';
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
    const session = ''; // TODO
    if (!session) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user exist
    const user = { id: '' }; // TODO

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
    throw err;
  }
};

export const loginHandler = async ({
  input,
  ctx: { req, res },
}: {
  input: LoginUserInput;
  ctx: Context;
}) => {
  try {
    const { username, password } = input;
    const untis = new WebUntis(
      customConfig.school,
      username,
      password,
      customConfig.schoolBaseUrl,
    );

    await untis.login();

    // Create the Access and refresh Tokens TODO

    // Send Access Token in Cookie TODO

    // Send Access Token (return) TODO
  } catch (err: any) {
    // Add logging TODO
    throw err;
  }
};

export const logoutHandler = async ({ ctx }: { ctx: ContextWithUser }) => {
  try {
    const { req, res, user } = ctx;

    // Delete user session from the database TODO

    // Reset browser cookies
    setCookie('access_token', '', { req, res, maxAge: -1 });
    setCookie('refresh_token', '', { req, res, maxAge: -1 });
    setCookie('logged_in', '', { req, res, maxAge: -1 });
  } catch (err: any) {
    // Add logging TODO
    throw err;
  }
};
