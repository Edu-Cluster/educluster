import React, { useEffect } from 'react';
import ItemList from '../components/Item/ItemList';
import type { User } from '../lib/types';
import type { NextPage } from 'next';
import trpc from '../client/trpc';
import useStore from '../client/store';
import { MoonLoader } from 'react-spinners';

const DashboardPage: NextPage = () => {
  const store = useStore();

  const clusterQuery = trpc.useQuery(['cluster.mine'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setCluster(data);
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const appointmentQuery = trpc.useQuery(['appointment.mine'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setAppointment(data);
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      store.setAuthUser(data.user as User);
      await clusterQuery.refetch(data.user);
      await appointmentQuery.refetch(data.user);
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
          <ItemList items={store.cluster?.cluster} title="Cluster" />
          <ItemList
            items={store.appointments?.appointments}
            title="Lerneinheiten"
          />
        </div>
        <div className="h-[300px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16">
          <div className="h-full w-full flex flex-col items-center">
            <div className="w-full h-36 flex justify-center items-center gap-5">
              <div className="h-20 w-20 border-2 rounded-[50%] text-black"></div>
              <p className="uppercase text-4xl">{store.authUser?.role}</p>
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
