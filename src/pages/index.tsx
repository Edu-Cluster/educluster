import React, { useEffect } from 'react';
import ItemList from '../components/Item/ItemList';
import type { NextPage } from 'next';
import trpc from '../lib/trpc';
import useStore from '../lib/store';
import { resources } from '../lib/enums';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import IdentityBadge from '../components/IdentityBadge';

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

        <IdentityBadge />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default DashboardPage;
