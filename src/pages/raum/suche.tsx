import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import RoomFilterBox from '../../components/Room/RoomFilterBox';
import Loader from '../../components/Loader';

const RoomSearchPage: NextPage = () => {
  const { setAuthUser, setRooms, rooms } = useStore();

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      setAuthUser(data.user as User);
      setRooms(null);
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
          <RoomFilterBox showResetButton={!!rooms} />
          <ItemList
            resource={resources.ROOM}
            items={rooms}
            placeholder="Benutze das Suchfeld oder die Filter um nach Räumen zu suchen"
          />
        </div>
      </main>
    );
  }

  return <Loader type="main" size={100} />;
};

export default RoomSearchPage;
