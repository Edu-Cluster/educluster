import React, { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { PencilIcon } from '@heroicons/react/outline';
import ItemList from '../components/Information/ItemList';
import useStore from '../client/store';
import type { User, Item } from '../types';
import type { NextPage } from 'next';

const items: Item[] = [
  {
    type: { category: 1 },
    tags: ['M', 'POS'],
    title: 'Eine Lerneinheit',
    description: 'Meine erste Lerneinheit',
    host: 'Mr. Admin',
    room: '1AHIF',
    participants: ['Ich', 'Christoph', 'Lara'],
    maxParticipants: 5,
  },
  {
    type: { category: 1 },
    tags: ['M', 'D'],
    title: 'Eine zweite Lerneinheit',
    description: 'Meine zweite Lerneinheit',
    host: 'Mr. Admin',
    room: null,
    participants: ['Ich', 'Christoph', 'Lara'],
    maxParticipants: 3,
  },
  {
    type: { category: 0 },
    tags: null,
    title: 'Ein Cluster',
    description: 'Mein erster Cluster',
    host: 'Mr. Admin',
    room: null,
    participants: ['Ich'],
    maxParticipants: 2,
  },
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
    <main className="h-auto flex w-full justify-center mt-5 screen-xxl:mt-20 gap-5 px-2 sm:px-24 lg:px-12 screen-xxxl:px-36 flex-wrap-reverse screen-xxl:flex-nowrap">
      <div className="h-[700px] w-full flex justify-center screen-xxl:justify-start gap-5 flex-wrap lg:w-auto screen-xxl:w-full screen-xxl:flex-nowrap">
        <div className="min-w-[250px] card">
          <div>TEST</div>
        </div>
        <div className="w-full screen-xxl:max-w-[800px] h-full overflow-y-auto card">
          <ItemList items={items} />
        </div>
      </div>

      <div className="h-[300px] w-full max-w-[850px] screen-xxl:max-w-[400px] sm:min-w-[400px] flex flex-col divide-y gap-5 card">
        <div className="h-full w-full flex flex-col">
          <div className="w-full h-36 flex justify-center items-center gap-5">
            <div className="h-20 w-20 border-2 rounded-[50%] text-black"></div>
            <p className="uppercase text-4xl">Schüler</p>
          </div>
          <div className="w-full h-16 flex justify-center items-center gap-2">
            <p className="text-xl">irgendeinuser@test.com</p>
            <PencilIcon className="h-4 w-4 inline cursor-pointer" />
          </div>
          <div className="w-full h-16 flex justify-center items-center gap-2">
            <p className="text-xl">Nameanemanemaha</p>
            <PencilIcon className="h-4 w-4 inline cursor-pointer" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
