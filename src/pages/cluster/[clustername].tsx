import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { User } from '../../lib/types';
import { resources, statusCodes } from '../../lib/enums';
import { useRouter } from 'next/router';
import trpc from '../../lib/trpc';
import useStore from '../../lib/store';
import ClusterBanner from '../../components/Cluster/ClusterBanner';
import Loader from '../../components/Loader';

const ClusterPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { clustername: clusterfullname } = router.query;

  useEffect(() => {
    if (Array.isArray(clusterfullname)) {
      clusterfullname = clusterfullname[0];
    }

    if (clusterfullname && !clusterfullname.includes('*')) {
      document.location.href = '/404';
    }

    // Fetch user and set store state
    userQuery.refetch();
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
        store.setClusterDetails(data.clusterDetails);
        store.setUserOfCluster(data.user);
        store.setAppointmentOfCluster(data.appointments);
      }
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const clusterAssociationQuery = trpc.useQuery(
    ['item.clusterAssociation', clusterId as number],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          store.setClusterAssociation(data.association);
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      store.setAuthUser(data.user as User);

      // Fetch cluster association
      await clusterAssociationQuery.refetch();

      // Fetch cluster details, learning units and members
      await itemsOfClusterQuery.refetch();
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  if (itemsOfClusterQuery.isSuccess) {
    if (itemsOfClusterQuery.data.status === statusCodes.FAILURE) {
      document.location.href = '/404';
      return <></>;
    }

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

        <ClusterBanner />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default ClusterPage;
