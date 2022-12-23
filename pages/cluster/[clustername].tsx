import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { Item, Member, User } from '../../lib/types';
import { roles } from '../../lib/enums';
import { useRouter } from 'next/router';
import trpc from '../../client/trpc';
import useStore from '../../client/store';
import ClusterBanner from '../../components/Cluster/ClusterBanner';
import { MoonLoader } from 'react-spinners';

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

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
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
    userQuery.refetch();
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="list-container">
          <MemberList members={members} />
          <ItemList items={learningUnits} title="Lerneinheiten" />
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

export default CreateClusterPage;
