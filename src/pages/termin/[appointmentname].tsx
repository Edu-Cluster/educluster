import { NextPage } from 'next';
import useStore from '../../lib/store';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import trpc from '../../lib/trpc';
import { User } from '../../lib/types';
import { statusCodes } from '../../lib/enums';
import MemberList from '../../components/Member/MemberList';
import Loader from '../../components/Loader';
import AppointmentBanner from '../../components/Appointment/AppointmentBanner';
import Tag from '../../components/SubjectTopic/Tag';
import ItemListHeader from '../../components/Item/ItemListHeader';

const AppointmentPage: NextPage = () => {
  const store = useStore();
  const router = useRouter();
  let { appointmentname: appointmentfullname } = router.query;

  useEffect(() => {
    if (Array.isArray(appointmentfullname)) {
      appointmentfullname = appointmentfullname[0];
    }

    if (appointmentfullname && !appointmentfullname.includes('*')) {
      document.location.href = '/404';
    }

    // TODO Lara/Denis: Wenn Termin aus einem privaten Cluster stammt, darf diese Seite nur von Mitglieder besucht werden

    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  const clusterId =
    appointmentfullname &&
    Number((appointmentfullname as string).split('*')[1]);
  const clustername =
    appointmentfullname && (appointmentfullname as string).split('*')[0];
  const input = { clusterId, clustername };

  const tags: any[] = [{ name: 'testtag' }]; // TODO Lara

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      store.setAuthUser(data.user as User);

      // Fetch appointment association
      // TODO Lara

      // Fetch appointment details
      // TODO Lara EC-100
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  if (userQuery.isSuccess) {
    if (userQuery.data.status === statusCodes.FAILURE) {
      document.location.href = '/404';
      return <></>;
    }

    return (
      <main className="page-default">
        <div className="list-container">
          <MemberList members={store.userOfCluster} />
          {tags && tags.length && (
            <div className="h-fit w-full max-w-[800px] mt-8">
              <ItemListHeader title="Tags" />
              <div className="mt-2 px-2">
                {tags.map((tag, idx) => (
                  <Tag key={idx} name={tag.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        <AppointmentBanner />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default AppointmentPage;
