import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MemberList from '../../../components/Member/MemberList';
import MemberSearchField from '../../../components/Member/MemberSearchField';
import trpc from '../../../lib/trpc';
import useStore from '../../../lib/store';
import { User } from '../../../lib/types';
import ClusterBanner from '../../../components/Cluster/ClusterBanner';
import MemberSearchResultArea from '../../../components/Member/MemberSearchResultArea';
import { clusterAssociations } from '../../../lib/enums';
import Loader from '../../../components/Loader';

const InviteClusterPage: NextPage = () => {
  const router = useRouter();
  const {
    setAuthUser,
    membersToInvite,
    setClusterDetails,
    setClusterAssociation,
  } = useStore();
  let { clustername } = router.query;

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();

    if (Array.isArray(clustername)) {
      clustername = clustername[0];
    }

    if (clustername && !clustername.includes('*')) {
      document.location.href = '/404';
    }
  }, []);

  const pageLimit = 10;
  let members = [];

  for (let i = 0; i < Math.ceil(membersToInvite.length / pageLimit); i++) {
    let start = 0;
    let end = 10;

    members.push(membersToInvite.slice(start, end));

    start += 10;
    end += 10;
  }

  const clusterId =
    clustername && Number((clustername as string).split('*')[1]);
  const clusterDetailsQuery = trpc.useQuery(
    // @ts-ignore
    ['item.clusterDetails', clusterId],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          setClusterDetails(data.clusterDetails);
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const clusterAssociationQuery = trpc.useQuery(
    ['item.clusterAssociation', clusterId as number],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          if (data.association !== clusterAssociations.IS_ADMIN) {
            document.location.href = './';
          }

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

      // Fetch cluster details
      await clusterDetailsQuery.refetch();
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  if (clusterDetailsQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="list-container flex-wrap-reverse screen-xxxl:flex-nowrap">
          {/* @ts-ignore */}
          <MemberList members={members} isOnInvitationPage={true} />
          <div className="w-full lg:min-w-[400px] mt-16 flex flex-col gap-4">
            <MemberSearchField
              placeholder="Nach Benutzern suchen"
              clusterId={clusterId as number}
            />
            <MemberSearchResultArea isOnInvitationPage={true} />
          </div>
        </div>

        <ClusterBanner isNotMainPage={true} />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default InviteClusterPage;
