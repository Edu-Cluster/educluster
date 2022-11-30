import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import trpc from '../client/trpc';
import toast from 'react-hot-toast';
import { statusCodes } from '../lib/enums';
import useStore from '../client/store';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const store = useStore();
  const { register, setValue, getValues, handleSubmit } = useForm();
  const [isSliderOn, setSliderOn] = useState(false);

  const { mutate: registerUser } = trpc.useMutation(['auth.register'], {
    async onSuccess(data) {
      if (data.status === statusCodes.FAILURE) {
        toast.error(
          'Ein Benutzer hat sich bereits mit dieser E-Mail registriert!',
        );
        return;
      }

      const username = sessionStorage.getItem('username') || '';
      const password = sessionStorage.getItem('password') || '';
      const persistentCookie = sessionStorage.getItem('persistentCookie');

      sessionStorage.clear();

      loginUser({
        username,
        password,
        persistentCookie: persistentCookie === 'true',
      });
    },

    onError(error: any) {
      // Internal server error
      error.response.errors.forEach((err: any) => {
        console.error(err);
      });

      toast.error('Internal Server Error!');
    },
  });

  useEffect(() => {
    // @ts-ignore
    const code: string = router.query.code;

    if (code) {
      // Retrieve login credentials from local storage
      const username = sessionStorage.getItem('username') || '';

      registerUser({ username, code });
    }
  }, []);

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user);
    },
  });

  const { mutate: loginUser } = trpc.useMutation(['auth.login'], {
    async onSuccess(data) {
      toast.dismiss();

      if (data.status === statusCodes.SUCCESS) {
        // Reset input fields
        setValue('username', '');
        setValue('password', '');

        // Fetch user and set store state
        await query.refetch();

        // Redirect to dashboard
        await router.push('./');

        return;
      } else if (data.status === statusCodes.TENTATIVE) {
        const { username, password } = getValues();

        // Save login credentials in local storage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('persistentCookie', String(isSliderOn));

        // Redirect to microsoft login prompt TODO Lara/Denis: redirect_uri in development mode auf http://localhost:3000/login setzen!!!
        document.location.href = `
        https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize
        ?client_id=f7c7c0f0-1f3e-4444-b003-6e3c118178d0
        &response_type=code
        &redirect_uri=https://educluster-theta.vercel.app/login
        &response_mode=query
        &scope=User.ReadWrite`; // https://learn.microsoft.com/en-us/graph/permissions-reference#user-permissions
      } else if (data.status === statusCodes.FAILURE) {
        toast.error('Der Benutzername oder das Passwort ist falsch!');
      }
    },

    onError(error: any) {
      toast.dismiss();

      // Internal server error
      error.response.errors.forEach((err: any) => {
        console.error(err);
      });

      toast.error('Internal Server Error!');
    },
  });

  const onSubmit = handleSubmit(() => {
    // Get values from the input fields
    const { username, password } = getValues();

    toast.loading('Es wird nach Ihrem Profil gesucht...');

    // Send login POST request to auth router
    loginUser({ username, password, persistentCookie: isSliderOn });
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
              <input
                type="checkbox"
                onChange={() => setSliderOn((prevState) => !prevState)}
              />
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
