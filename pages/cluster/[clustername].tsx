import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { User } from '../../lib/types';
import { resources } from '../../lib/enums';
import { useRouter } from 'next/router';
import trpc from '../../client/trpc';
import useStore from '../../client/store';
import ClusterBanner from '../../components/Cluster/ClusterBanner';
import { MoonLoader } from 'react-spinners';

const ClusterPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { clustername } = router.query;
  if (Array.isArray(clustername)) {
    clustername = clustername[0];
  }
  let clusterId = Number(clustername?.substring(clustername?.indexOf('*') + 1));
  clustername = clustername?.substring(0, clustername?.indexOf('*'));
  let input = {
    clusterId: clusterId as number,
    clustername: clustername as string,
  };

  const itemsOfClusterQuery = trpc.useQuery(['item.ofCluster', input], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setUserOfCluster(data.user);
      store.setAppointmentOfCluster(data.appointments);
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
      await itemsOfClusterQuery.refetch();
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
          <MemberList members={store.userOfCluster} />
          <ItemList
            resource={resources.APPOINTMENT}
            items={store.appointmentOfCluster}
            title="Lerneinheiten"
          />
        </div>

        <ClusterBanner
          name={clustername as string}
          isPrivate={false}
          description="Eine generische Beschreibung eines Clusters mit dem Zweck zu demonstrieren."
        />
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <MoonLoader size={80} />
    </main>
  );
};

export default ClusterPage;
