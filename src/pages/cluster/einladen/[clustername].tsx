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
import { MoonLoader } from 'react-spinners';

const InviteClusterPage: NextPage = () => {
  const router = useRouter();
  const { setAuthUser, membersToInvite } = useStore();
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

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      setAuthUser(data.user as User);

      // Fetch cluster details
      // TODO Lara
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="list-container flex-wrap-reverse screen-xxxl:flex-nowrap">
          {/* @ts-ignore TODO Denis/Lara Type-Problem */}
          <MemberList members={members} isOnInvitationPage={true} />
          <div className="w-full lg:min-w-[400px] mt-16 flex flex-col gap-4">
            <MemberSearchField placeholder="Nach Benutzern suchen" />
            <MemberSearchResultArea isOnInvitationPage={true} />
          </div>
        </div>

        <ClusterBanner
          name={clustername as string}
          isPrivate={false}
          description="Eine generische Beschreibung eines Clusters mit dem Zweck zu demonstrieren."
          isOnInvitationPage={true}
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

export default InviteClusterPage;
