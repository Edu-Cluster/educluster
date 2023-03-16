import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../lib/store';
import ItemList from '../../components/Item/ItemList';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import RoomFilterBox from '../../components/Room/RoomFilterBox';
import Loader from '../../components/Loader';
import { useRouter } from 'next/router';

const RoomSearchPage: NextPage = () => {
  const { setAuthUser, setRooms, rooms, appointmentRoomSelected } = useStore();
  const { query } = useRouter();

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
    if (
      !query.name &&
      !query.description &&
      !query.subject &&
      !query.topics &&
      !query.cluster
    ) {
      document.location.href = '../../';
    }

    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default h-auto">
        <div className="w-full max-w-[800px] mt-16 flex flex-col gap-4">
          <RoomFilterBox
            showResetButton={!!rooms}
            showSummary={appointmentRoomSelected}
          />
          {!appointmentRoomSelected && (
            <ItemList
              resource={resources.ROOM}
              items={rooms}
              placeholder='Klicke auf "Alle Filter Übernehmen" um nach Räumen zu suchen'
            />
          )}
        </div>
      </main>
    );
  }

  return <Loader type="main" size={100} />;
};

export default RoomSearchPage;
