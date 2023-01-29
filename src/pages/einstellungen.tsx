import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import trpc from '../lib/trpc';
import useStore from '../lib/store';
import Avatar from '../components/Avatar';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { FormProvider, useForm } from 'react-hook-form';
import { useTheme } from 'next-themes';
import RegisteredSearchField from '../components/RegisteredSearchField';

const SettingsPage: NextPage = () => {
  const { setAuthUser, authUser } = useStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const methods = useForm();
  const { setValue, getValues, handleSubmit } = methods;

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      setAuthUser(data.user);
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  const { mutate: updateUsernameMutation } = trpc.useMutation(
    ['user.updateUsername'],
    {
      onSuccess: async () => {
        await userQuery.refetch();
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();

    setMounted(true);
  }, []);

  const switchMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const onSubmit = handleSubmit(async () => {
    // Get value from the input field
    const { username } = getValues();

    setValue('username', '');

    await updateUsernameMutation(username);
  });

  if (!mounted) return <></>;

  return (
    <main className="page-default">
      <div className="h-[300px] w-full max-w-[800px] mt-16 card">
        <FormProvider {...methods}>
          <form
            onSubmit={onSubmit}
            className="h-auto flex flex-col items-center mt-2 input-mask"
          >
            <p className="text-xl mt-5">Neuer Benutzername</p>
            <div className="mt-4 flex justify-center">
              <RegisteredSearchField
                registerInputName="username"
                name="username"
                type="text"
                maxLength={20}
                minLength={5}
                required={true}
                noIcon={true}
                placeholder={authUser?.username}
              />
              <button type="submit" className="settings-button ml-4">
                <ChevronRightIcon height={20} width={20} />
              </button>
            </div>
            <p className="text-xl mt-12">Light/Dark Mode</p>
            <label className="switch mt-4">
              <input
                type="checkbox"
                checked={resolvedTheme === 'dark'}
                onChange={switchMode}
              />
              <span className="slider round"></span>
            </label>
          </form>
        </FormProvider>
      </div>
      <div className="h-[300px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16">
        <div className="h-full w-full flex flex-col items-center">
          <div className="w-full h-36 flex justify-center items-center gap-5">
            <div
              className={`h-20 ${
                authUser?.username
                  ? 'w-40'
                  : 'w-20 border-2 rounded-[50%] text-black'
              } flex justify-center items-center`}
            >
              <Avatar
                type="user"
                seed={authUser?.username}
                bigger={true}
                rounded={true}
              />
            </div>
          </div>
          <p className="text-xl mb-5">{authUser?.username}</p>
          <p className="text-xl">{authUser?.teams_email}</p>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
