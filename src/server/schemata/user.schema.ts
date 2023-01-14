import { object, string, boolean, TypeOf } from 'zod';

export const loginUserSchema = object({
  username: string({ required_error: 'Benutzername ist erforderlich!' }),
  password: string({ required_error: 'Passwort ist erforderlich!' }),
  persistentCookie: boolean(),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = object({
  code: string({ required_error: 'Authorisierungs-Code ist erforderlich!' }),
  username: string({ required_error: 'Benutzername ist erforderlich!' }),
});

export type RegisterUserSchema = TypeOf<typeof registerUserSchema>;

export const userSchema = string({
  required_error: 'Benutzername ist erforderlich!',
});

export type UserSchema = TypeOf<typeof userSchema>;