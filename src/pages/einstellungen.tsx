import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import trpc from '../lib/trpc';
import useStore from '../lib/store';
import Avatar from '../components/Avatar';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { setCookie } from 'cookies-next';

const SettingsPage: NextPage = () => {
  const { setAuthUser, authUser } = useStore();
  const [isSliderOn, setSliderOn] = useState(false);

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

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  const switchMode = () => {
    setCookie('experience', !isSliderOn ? 'dark' : 'white', {
      maxAge: 60 * 60 * 24 * 399,
    });

    setSliderOn((prevState: any) => !prevState);
  };

  const renameUser = () => {
    // TODO Denis
  };

  return (
    <main className="page-default">
      <div className="h-[300px] w-full max-w-[800px] mt-16 card">
        <form className="h-auto flex flex-col items-center mt-2 input-mask">
          <p className="text-xl mt-5">Neuer Benutzername</p>
          <div className="input-box mt-4 flex justify-center">
            <input
              name="educluster-username"
              type="text"
              maxLength={20}
              placeholder={authUser?.username}
            />
            <div className="settings-button ml-4" onClick={renameUser}>
              <ChevronRightIcon height={20} width={20} />
            </div>
          </div>
          <p className="text-xl mt-12">Dark/Light Mode</p>
          <label className="switch mt-4">
            <input type="checkbox" checked={isSliderOn} onChange={switchMode} />
            <span className="slider round"></span>
          </label>
        </form>
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
