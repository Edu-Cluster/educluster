import React, { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import ItemList from '../components/Information/ItemList';
import useStore from '../client/store';
import type { User, Item } from '../types';
import type { NextPage } from 'next';

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

  useEffect(() => {
    const cookie = getCookie('session');

    if (!cookie) {
      store.setAuthUser(null);
      document.location.href = './login';
    } else if (cookie && !store.authUser) {
      if (typeof cookie === 'string') {
        store.setAuthUser(JSON.parse(cookie) as User);
      }
    }
  }, []);

  return (
    <main className="h-auto flex w-full justify-center mt-5 screen-xxl:mt-12 gap-5 px-2 pb-24 sm:px-24 lg:px-12 screen-xxxl:px-36 flex-wrap-reverse screen-xxl:flex-nowrap">
      <div className="w-full flex justify-center screen-xxl:justify-start gap-5 flex-wrap lg:w-auto screen-xxl:w-full screen-xxxl:flex-nowrap">
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
};

export default DashboardPage;
