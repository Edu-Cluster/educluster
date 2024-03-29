import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import trpc from '../lib/trpc';
import toast from 'react-hot-toast';
import { statusCodes } from '../lib/enums';
import useStore from '../lib/store';
import RegisteredSearchField from '../components/RegisteredSearchField';
import Image from 'next/image';
import LoginPicture from '../../public/assets/LoginPicture.png';
import Logo from '../components/Logo';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const store = useStore();
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;
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
      console.error(error);
      toast.error('Bei der Registrierung ist etwas falsch gelaufen!');
    },
  });

  useEffect(() => {
    // @ts-ignore
    const code: string = router.query.code;

    if (code) {
      // Retrieve login credentials from local storage
      const username = sessionStorage.getItem('username') as string;

      registerUser({ username, code });
    }
  }, []);

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
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
        await userQuery.refetch();

        // Redirect to dashboard
        document.location.href = './';

        return;
      } else if (data.status === statusCodes.TENTATIVE) {
        const { username, password } = getValues();

        // Save login credentials in local storage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('persistentCookie', String(isSliderOn));

        // Redirect to microsoft login prompt
        // TODO Lara/Denis: redirect_uri in development mode auf http://localhost:3000/login setzen!!!
        document.location.href = `
        https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize
        ?client_id=f7c7c0f0-1f3e-4444-b003-6e3c118178d0
        &response_type=code
        &redirect_uri=https://educluster-theta.vercel.app/login
        &response_mode=query
        &scope=User.ReadWrite`; // https://learn.microsoft.com/en-us/graph/permissions-reference#user-permissions
      } else if (data.status === statusCodes.FAILURE) {
        toast.error('Der Benutzername oder das Passwort ist falsch!');
        console.error(data.error);
      }
    },

    onError(error: any) {
      toast.dismiss();

      // Internal server error
      console.error(error);

      toast.error('Beim Einloggen ist etwas falsch gelaufen!');
    },
  });

  const onSubmit = handleSubmit(async () => {
    // Get values from the input fields
    const { username, password } = getValues();

    toast.loading('Es wird nach Ihrem Profil gesucht...');

    // Send login POST request to auth router
    await loginUser({ username, password, persistentCookie: isSliderOn });
  });

  return (
    <main className="w-full h-screen flex justify-center screen-xxl:justify-between items-center overflow-y-hidden">
      <div className="h-full hidden screen-xxl:block">
        <Image
          alt="Ein Stapel von Büchern"
          priority={true}
          src={LoginPicture}
        />
      </div>
      <div className="w-[90%] screen-xxl:w-[50%] h-full lg:h-[700px] input-mask grid grid-rows-3">
        <div className="flex items-center justify-center w-full pt-12">
          <Logo bigger={true} />
        </div>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} id="login-form">
            <div className="flex items-center justify-center w-full h-full flex-col gap-5">
              <div className="w-full sm:w-[80%]">
                <RegisteredSearchField
                  registerInputName="username"
                  name="username"
                  type="text"
                  noIcon={true}
                  required={true}
                  placeholder="Benutzername"
                />
              </div>
              <div className="w-full sm:w-[80%]">
                <RegisteredSearchField
                  registerInputName="password"
                  name="password"
                  type="password"
                  noIcon={true}
                  required={true}
                  placeholder="Password"
                />
              </div>
            </div>
          </form>
        </FormProvider>
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
