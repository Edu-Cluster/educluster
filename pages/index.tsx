import React, { useEffect } from 'react';
import ItemList from '../components/Item/ItemList';
import type { Item, User } from '../lib/types';
import type { NextPage } from 'next';
import trpc from '../client/trpc';
import useStore from '../client/store';

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
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
  ],
  [
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
  ],
  [
    {
      type: { category: 1 },
      tags: ['M', 'D'],
      title: 'Eine zweite Lerneinheit',
      description: 'Meine zweite Lerneinheit',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
  ],
];

const clusters: Item[][] = [
  [
    {
      type: { category: 0 },
      tags: null,
      title: 'Ein Cluster',
      description: 'Mein erster Cluster',
      host: 'Mr. Admin',
      room: null,
      link: '/',
    },
  ],
];

const DashboardPage: NextPage = () => {
  const store = useStore();

  const query = trpc.useQuery(['user.me'], {
    enabled: false,
    onSuccess: ({ data }) => {
      store.setAuthUser(data.user as User);
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

  if (query.isSuccess) {
    return (
      <main className="page-default">
        <div className="list-container">
          <ItemList items={learningUnits} title="Lerneinheiten" />
          <ItemList items={clusters} title="Cluster" />
        </div>

        <div className="h-[300px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16">
          <div className="h-full w-full flex flex-col items-center">
            <div className="w-full h-36 flex justify-center items-center gap-5">
              <div className="h-20 w-20 border-2 rounded-[50%] text-black"></div>
              <p className="uppercase text-4xl">Schüler</p>
            </div>
            <p className="text-xl mb-5">Nameanemanemaha</p>
            <p className="text-xl">irgendeinuser@test.com</p>
          </div>
        </div>
      </main>
    );
  }

  return <div>LOADING</div>;
};

export default DashboardPage;
