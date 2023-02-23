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
  const {
    setClusterDetails,
    userOfCluster,
    setUserOfCluster,
    appointmentOfCluster,
    setAppointmentOfCluster,
    setClusterAssociation,
    setAuthUser,
  } = useStore();
  const router = useRouter();
  let { clustername: clusterfullname } = router.query;

  useEffect(() => {
    if (Array.isArray(clusterfullname)) {
      clusterfullname = clusterfullname[0];
    }

    if (clusterfullname && !clusterfullname.includes('*')) {
      document.location.href = '/404';
    }

    // TODO Lara/Denis: Wenn Cluster privat ist, darf diese Seite nur von Mitglieder besucht werden

    // Reset usersOfCluster state
    setUserOfCluster(null);

    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  const clusterId =
    clusterfullname && Number((clusterfullname as string).split('*')[1]);
  const clustername =
    clusterfullname && (clusterfullname as string).split('*')[0];
  const input = { id: clusterId, name: clustername };

  // @ts-ignore
  const itemsOfClusterQuery = trpc.useQuery(['item.ofCluster', input], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (data) {
        setClusterDetails(data.clusterDetails);
        setUserOfCluster(data.user);
        setAppointmentOfCluster(data.appointments);
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
          setClusterAssociation(data.association);
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
      setAuthUser(data.user as User);

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
          <MemberList members={userOfCluster} />
          <ItemList
            resource={resources.APPOINTMENT}
            items={appointmentOfCluster}
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
