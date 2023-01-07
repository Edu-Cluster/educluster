import React, { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { resources } from '../../lib/enums';
import useStore from '../../client/store';
import ItemSearchField from '../../components/Item/ItemSearchField';
import ItemList from '../../components/Item/ItemList';
import AppointmentFilterBox from '../../components/Appointment/AppointmentFilterBox';
import trpc from '../../client/trpc';
import { User } from '../../lib/types';
import { MoonLoader } from 'react-spinners';
import { SocketContext } from '../_app';

const AppointmentSearchPage: NextPage = () => {
  const { setAuthUser, appointmentsOfUser, setAppointmentOfUser } = useStore();
  const socket = useContext(SocketContext);

  // TODO Lara (EC-94): Zeitfelder aus der Datenbank holen und ein global state setzen

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: ({ data }) => {
      setAuthUser(data.user as User);

      // Emit new user event to socket server
      // @ts-ignore
      socket?.emit('newUser', data.user?.username);
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  useEffect(() => {
    // Fetch user and set store state
    userQuery.refetch();
    setAppointmentOfUser(null);
  }, []);

  if (userQuery.isSuccess) {
    return (
      <main className="page-default">
        <div className="w-full max-w-[800px] mt-16 flex flex-col gap-4">
          <ItemSearchField
            resource={resources.APPOINTMENT}
            placeholder="Nach Terminen suchen"
            name="appointment-search"
          />
          <AppointmentFilterBox showResetButton={!!appointmentsOfUser} />
          <ItemList
            resource={resources.APPOINTMENT}
            items={appointmentsOfUser}
            placeholder="Benutze das Suchfeld oder die Filter um nach Lerneinheiten zu suchen"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <MoonLoader size={80} />
    </main>
  );
};

export default AppointmentSearchPage;