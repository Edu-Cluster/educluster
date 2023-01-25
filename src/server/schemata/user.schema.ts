import { object, string, boolean, number, TypeOf } from 'zod';

export const loginUserSchema = object({
  username: string(),
  password: string(),
  persistentCookie: boolean(),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = object({
  code: string(),
  username: string(),
});

export type RegisterUserSchema = TypeOf<typeof registerUserSchema>;

export const userSchema = object({
  username: string(),
  clusterId: number(),
});

export type UserSchema = TypeOf<typeof userSchema>;
