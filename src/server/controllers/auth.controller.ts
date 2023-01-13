import { TRPCError } from '@trpc/server';
import { OptionsType } from 'cookies-next/lib/types';
import { deleteCookie, getCookie, setCookie, hasCookie } from 'cookies-next';
import { LoginUserInput, RegisterUserSchema } from '../schemata/user.schema';
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
import axios, { AxiosRequestConfig } from 'axios';
import {
  AuthProvider,
  AuthProviderCallback,
  Client,
} from '@microsoft/microsoft-graph-client';
import { NextApiRequest, NextApiResponse } from 'next';

// Options
const cookieOptions: OptionsType = {
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

/**
 * Refreshes the access token.
 *
 * @param req
 * @param res
 */
export const refreshAccessTokenHandler = async ({
  ctx: { req, res },
}: {
  ctx: { req: NextApiRequest; res: NextApiResponse };
}) => {
  try {
    const message = 'Could not refresh access token!';

    // If session expired, the access token will not be refreshed
    if (
      !hasCookie('session', { req, res }) ||
      !hasCookie('refresh_token', { req, res })
    ) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Get the refresh token from cookie
    const refresh_token = getCookie('refresh_token', { req, res }) as string;

    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey',
    );

    if (!decoded) {
      throw new TRPCError({ code: 'FORBIDDEN', message });
    }

    // Check if the user with this session still exists
    const user = await readEduClusterUsername(decoded.sub);

    if (!user) {
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

    // Set the access token as cookie
    setCookie('access_token', access_token, {
      req,
      res,
      ...accessTokenCookieOptions,
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
      originalError: err,
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
  input: RegisterUserSchema;
}) => {
  try {
    const { username, code } = input;
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `client_id=f7c7c0f0-1f3e-4444-b003-6e3c118178d0
              &scope=User.ReadWrite
              &code=${code}
              &redirect_uri=${
                process.env.NODE_ENV === 'production'
                  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
                  : 'http://localhost:3000/login'
              }
              &grant_type=authorization_code
              &client_secret=4yl8Q~Q8bJluD2hvXQLs9Jg.5tNd3WZUrO6C0drZ`,
      url: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
      method: 'post',
    };
    const res = await axios(config); // Send token request with authorization code
    const authProvider: AuthProvider = (callback: AuthProviderCallback) => {
      callback(null, res?.data?.access_token);
    };
    const graph = Client.init({ authProvider });
    const user = await graph.api('/me').get(); // Retrieve details of authenticated user

    // If no user details found or user email missing, cannot continue
    if (!user || !user.mail) {
      throw new Error('No user found by MS Graph!');
    }

    const existingUserCount: number = await teamsEmailAlreadyExists(user.mail);

    // Ensure this email isn't already in use on another account
    if (existingUserCount) {
      return { status: statusCodes.FAILURE };
    }

    // Update user with this new email
    await writeTeamsEmailToUser(username, user.mail);

    return { status: statusCodes.SUCCESS };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
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
      return { status: statusCodes.FAILURE, error: err };
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
      maxAge: persistentCookie ? 60 * 60 * 24 * 399 : undefined,
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
      originalError: err,
    });
  }
};

/**
 * Handles the logout process.
 * Note: The logout process only concerns EduCluster and has no relation to the WebUntis logout process.
 */
export const logoutHandler = async ({
  ctx: { req, res },
}: {
  ctx: ContextWithUser;
}) => {
  try {
    // Delete browser cookies
    deleteCookie('access_token', { req, res });
    deleteCookie('refresh_token', { req, res });
    deleteCookie('session', { req, res });

    return { status: statusCodes.SUCCESS };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      originalError: err,
    });
  }
};
