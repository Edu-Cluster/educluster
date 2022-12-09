import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ClusterList from '../../components/Item/ClusterList';
import MemberList from '../../components/Member/MemberList';
import { Item, Member, User } from '../../lib/types';
import { roles } from '../../lib/enums';
import { useRouter } from 'next/router';
import trpc from '../../client/trpc';
import useStore from '../../client/store';
import ClusterBanner from '../../components/Cluster/ClusterBanner';

const learningUnits: Item[][] = [
  [
    {
      type: { category: 1 },
      tags: ['M', 'POS'],
      title: 'Eine Lerneinheit Eine Lerneinheit Eine Lerneinheit',
      description:
        'Meine erste Lerneinheit Meine erste Lerneinheit Meine erste Lerneinheit Meine erste Lerneinheit',
      host: 'Mr. Admin',
      room: '1AHIF',
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'POS'],
      title: 'Eine Lerneinheit',
      description:
        'Meine erste Lerneinheit Meine erste Lerneinheit Meine erste Lerneinheit Meine erste Lerneinheit',
      host: 'Mr. Admin',
      room: '1AHIF',
      link: '/',
    },
  ],
];

const members: Member[][] = [
  [
    {
      username: 'KiesseseWetter',
      role: roles.ADMINISTRATOR,
    },
  ],
];

const CreateClusterPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { clustername } = router.query;

  if (Array.isArray(clustername)) {
    clustername = clustername[0];
  }

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);

      // Fetch cluster details, learning units and members
      // TODO Lara
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    query.refetch();
  }, []);

  return (
    <main className="page-default">
      <div className="list-container">
        <MemberList members={members} />
        <ClusterList cluster={learningUnits} title="Lerneinheiten" />
      </div>

      <ClusterBanner
        name={clustername as string}
        isPrivate={false}
        description="Eine generische Beschreibung eines Clusters mit dem Zweck zu demonstrieren."
      />
    </main>
  );
};

export default CreateClusterPage;
