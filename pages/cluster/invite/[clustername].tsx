import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MemberList from '../../../components/Member/MemberList';
import MemberSearchField from '../../../components/Member/MemberSearchField';
import trpc from '../../../client/trpc';
import useStore from '../../../client/store';
import { User } from '../../../lib/types';
import { resources } from '../../../lib/enums';
import ClusterBanner from '../../../components/Cluster/ClusterBanner';
import MemberSearchResultArea from '../../../components/Member/MemberSearchResultArea';

const InviteClusterPage: NextPage = () => {
  const { setAuthUser, membersToInvite } = useStore();
  const router = useRouter();
  let { clustername } = router.query;

  const pageLimit = 10;
  let members = [];

  for (let i = 0; i < Math.ceil(membersToInvite.length / pageLimit); i++) {
    let start = 0;
    let end = 10;

    members.push(membersToInvite.slice(start, end));

    start += 10;
    end += 10;
  }

  if (Array.isArray(clustername)) {
    clustername = clustername[0];
  }

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      setAuthUser(data.user as User);

      // Fetch cluster details
      // TODO Lara
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '../../login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    query.refetch();
  }, []);

  return (
    <main className="page-default">
      <div className="list-container">
        <MemberList members={members} isOnInvitationPage={true} />
        <div className="md:min-w-[515px] mt-16 flex flex-col gap-4">
          <MemberSearchField
            resource={resources.USER}
            placeholder="Nach Benutzern mit Benutzername oder E-Mail suchen"
          />
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
};

export default InviteClusterPage;
