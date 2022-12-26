import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../client/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import trpc from '../../client/trpc';
import { User } from '../../lib/types';
import { MoonLoader } from 'react-spinners';
import RoomFilterBox from '../../components/Room/RoomFilterBox';

const RoomSearchPage: NextPage = () => {
  const store = useStore();

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
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
    userQuery.refetch();
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="w-full max-w-[800px] mt-16 flex flex-col gap-4">
          <ItemSearchField
            resource={resources.ROOM}
            placeholder="Nach Räumen suchen"
            name="room-search"
          />
          <RoomFilterBox showResetButton={!!store.rooms} />
          <ItemList
            resource={resources.ROOM}
            items={store.rooms}
            placeholder="Benutze das Suchfeld oder die Filter um nach Räumen zu suchen"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <MoonLoader size={100} />
    </main>
  );
};

export default RoomSearchPage;
