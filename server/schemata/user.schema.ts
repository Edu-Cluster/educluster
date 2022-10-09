import { object, string, TypeOf } from 'zod';

export const loginUserSchema = object({
  username: string({ required_error: 'Benutzername ist erforderlich!' }),
  password: string({ required_error: 'Passwort ist erforderlich!' }),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
