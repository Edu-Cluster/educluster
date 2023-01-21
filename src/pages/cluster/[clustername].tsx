import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { User } from '../../lib/types';
import { resources } from '../../lib/enums';
import { useRouter } from 'next/router';
import trpc from '../../lib/trpc';
import useStore from '../../lib/store';
import ClusterBanner from '../../components/Cluster/ClusterBanner';
import { MoonLoader } from 'react-spinners';

const ClusterPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { clustername: clusterfullname } = router.query;

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();

    if (Array.isArray(clusterfullname)) {
      clusterfullname = clusterfullname[0];
    }

    if (clusterfullname && !clusterfullname.includes('*')) {
      document.location.href = '/404';
    }
  }, []);

  const clusterId =
    clusterfullname && Number((clusterfullname as string).split('*')[1]);
  const clustername =
    clusterfullname && (clusterfullname as string).split('*')[0];
  const input = { clusterId, clustername };

  // @ts-ignore
  const itemsOfClusterQuery = trpc.useQuery(['item.ofCluster', input], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (data) {
        console.log(data);
        store.setUserOfCluster(data.user);
        store.setAppointmentOfCluster(data.appointments);
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
      store.setAuthUser(data.user as User);

      // Fetch cluster details, learning units and members
      await itemsOfClusterQuery.refetch();
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

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
          name={clusterfullname as string}
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
