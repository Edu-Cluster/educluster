import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import ItemList from '../../components/Item/ItemList';
import MemberList from '../../components/Member/MemberList';
import { Item, Member, User } from '../../lib/types';
import { roles } from '../../lib/enums';
import { useRouter } from 'next/router';
import Avatar from '../../components/Avatar';
import ButtonGroup from '../../components/ButtonGroup';
import { trpc } from '../../client/trpc';
import useStore from '../../client/store';

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

      <div className="h-[700px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16 px-8 flex flex-col items-center justify-around">
        <div className="h-auto flex flex-col items-center mt-8">
          <p className="text-md underline">CLUSTER</p>
          <p className="uppercase text-2xl">{clustername}</p>
          <div className="mt-12 w-full h-24 flex justify-center items-center">
            <Avatar type="cluster" seed={clustername} bigger={true} />
          </div>
          <p className="mt-12 break-words break-all">
            asdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasfdasdfasdf
          </p>
        </div>
        <ButtonGroup />
      </div>
    </main>
  );
};

export default CreateClusterPage;
