import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { trpc } from '../client/utils/trpc';
import toast from 'react-hot-toast';

const LoginPage: NextPage = () => {
  const router = useRouter();
  // TODO Store variable

  const { register, setValue, getValues, handleSubmit } = useForm();

  /*
  * const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: (data) => {
      // TODO Set store state
    },
  });
  * */

  const { mutate: loginUser } = trpc.useMutation(['auth.login'], {
    async onSuccess(data) {
      if (data) {
        // TODO Save JWT Token as a cookie in the browser
        // TODO await query.refetch();
        await router.push('./dashboard');
        return;
      }

      toast.error('Der Benutzername oder das Passwort ist falsch!');
    },

    onError(error: any) {
      // Internal server error
      error.response.errors.forEach((err: any) => {
        console.error(err);
      });
    },
  });

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { username, password } = getValues();

    // Send login POST request to auth router
    loginUser({ username, password });

    // Reset input fields
    setValue('username', '');
    setValue('password', '');
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 h-screen bg-gray-100 pattern-bg">
      <div className="w-[40%] min-w-[360px] h-[575px] lg:h-[500px] rounded-lg input-mask">
        <div className="flex items-center justify-center w-full">
          <span>LOGO Placeholder</span>
        </div>
        <form onSubmit={onSubmit} id="login-form">
          <div className="flex items-center justify-center w-full h-full flex-col">
            <div className="input-box">
              <input
                {...register('username', { required: true })}
                name="username"
                type="text"
                autoComplete="username"
                required
              />
              <span>Benutzername</span>
            </div>
            <div className="input-box mt-6">
              <input
                {...register('password', { required: true })}
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              <span>Passwort</span>
            </div>
          </div>
        </form>
        <div className="flex justify-around items-center lg:justify-around w-full flex-col flex-wrap lg:flex-row mb-5 lg:mb-0">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-2">Angemeldet bleiben</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <button
            aria-label="Einloggen"
            className="w-[80%] lg:w-[40%] h-16 primary-button"
            type="submit"
            form="login-form"
          >
            Einloggen
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
