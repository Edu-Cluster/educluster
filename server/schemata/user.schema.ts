import { object, string, boolean, TypeOf } from 'zod';

export const loginUserSchema = object({
  username: string({ required_error: 'Benutzername ist erforderlich!' }),
  password: string({ required_error: 'Passwort ist erforderlich!' }),
  persistentCookie: boolean(),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = object({
  username: string({
    required_error: 'EduCluster Benutzername ist erforderlich!',
  }),
  email: string({ required_error: 'E-Mail ist erforderlich!' }),
});

export type registerUserSchema = TypeOf<typeof registerUserSchema>;
