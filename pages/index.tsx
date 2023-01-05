import React, { useEffect } from 'react';
import ItemList from '../components/Item/ItemList';
import type { NextPage } from 'next';
import trpc from '../client/trpc';
import useStore from '../client/store';
import { MoonLoader } from 'react-spinners';
import { resources, statusCodes } from '../lib/enums';
import Avatar from '../components/Avatar';

const DashboardPage: NextPage = () => {
  const store = useStore();

  const itemOfUserQuery = trpc.useQuery(['item.mine'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (data) {
        store.setClusterOfUser(data.cluster);
        store.setAppointmentOfUser(data.appointments);
      }
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      store.setAuthUser(data.user);

      if (data.user) {
        await itemOfUserQuery.refetch();
      }
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

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="list-container">
          <ItemList
            resource={resources.CLUSTER}
            items={store.clusterOfUser}
            title="Cluster"
          />
          <ItemList
            resource={resources.APPOINTMENT}
            items={store.appointmentsOfUser}
            title="Lerneinheiten"
          />
        </div>
        <div className="h-[300px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16">
          <div className="h-full w-full flex flex-col items-center">
            <div className="w-full h-36 flex justify-center items-center gap-5">
              <div
                className={`h-20 ${
                  store.authUser?.username
                    ? 'w-40'
                    : 'w-20 border-2 rounded-[50%] text-black'
                } flex justify-center items-center`}
              >
                <Avatar
                  type="user"
                  seed={store.authUser?.username}
                  bigger={true}
                  rounded={true}
                />
              </div>
            </div>
            <p className="text-xl mb-5">{store.authUser?.username}</p>
            <p className="text-xl">{store.authUser?.teams_email}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <MoonLoader size={80} />
    </main>
  );
};

export default DashboardPage;
