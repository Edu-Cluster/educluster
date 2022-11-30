import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { Item, Member, User } from '../../lib/types';
import { roles } from '../../lib/enums';
import { useRouter } from 'next/router';
import { trpc } from '../../client/trpc';
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
      document.location.href = '../login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    query.refetch();
  }, []);

  return (
    <main className="page-sizing flex justify-center screen-xxl:mt-12 gap-5 px-2 pb-24 sm:px-24 lg:px-12 screen-xxxl:px-36 flex-wrap-reverse screen-xxl:flex-nowrap">
      <div className="w-full flex justify-center screen-xxl:justify-start gap-5 flex-wrap lg:w-auto screen-xxl:w-full screen-xxxl:flex-nowrap">
        <MemberList members={members} />
        <ItemList items={learningUnits} title="Lerneinheiten" />
      </div>

      <ClusterBanner
        name={clustername as string}
        type="öffentlich/privat"
        description="asdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasfdasdfasdf"
      />
    </main>
  );
};

export default CreateClusterPage;
