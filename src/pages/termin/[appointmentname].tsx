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
  const {
    appointmentDetails,
    setAppointmentDetails,
    userOfAppointment,
    setUserOfAppointment,
    tagsOfAppointment,
    setTagsOfAppointment,
    setClusterAssociation,
    setAuthUser,
  } = useStore();
  const router = useRouter();
  let { appointmentname: appointmentfullname } = router.query;

  useEffect(() => {
    if (Array.isArray(appointmentfullname)) {
      appointmentfullname = appointmentfullname[0];
    }

    if (appointmentfullname && !appointmentfullname.includes('*')) {
      document.location.href = '/404';
    }

    // Reset userOfAppointment state
    setUserOfAppointment(null);

    // Fetch user and set store state
    userQuery.refetch();
  }, []);

  const appointmentId =
    appointmentfullname &&
    Number((appointmentfullname as string).split('*')[1]);
  const appointmentname =
    appointmentfullname && (appointmentfullname as string).split('*')[0];
  const input = { id: appointmentId, name: appointmentname };

  // @ts-ignore
  const itemsOfAppointmentQuery = trpc.useQuery(['item.ofAppointment', input], {
    enabled: false,
    onSuccess: async ({ data }) => {
      if (data) {
        setAppointmentDetails(data.appointmentDetails);
        setUserOfAppointment(data.user);
        setTagsOfAppointment(data.tags.map((obj: { topic: any }) => obj.topic));
      }
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  const clusterAssociationQuery = trpc.useQuery(
    ['item.clusterAssociation', Number(appointmentDetails?.cluster)],
    {
      enabled: false,
      onSuccess: async ({ data }) => {
        if (data) {
          setClusterAssociation(data.association);
        }
      },
      onError: async (err) => {
        console.error(err);
      },
    },
  );

  const userQuery = trpc.useQuery(['user.me'], {
    enabled: false,
    retry: 0,
    onSuccess: async ({ data }) => {
      setAuthUser(data.user as User);

      await itemsOfAppointmentQuery.refetch();
      await clusterAssociationQuery.refetch();
    },
    onError: async (err) => {
      console.error(err);
      document.location.href = '/login';
    },
  });

  if (itemsOfAppointmentQuery.isSuccess) {
    if (itemsOfAppointmentQuery.data.status === statusCodes.FAILURE) {
      document.location.href = '/404';
      return <></>;
    }

    return (
      <main className="page-default">
        <div className="list-container">
          <MemberList members={userOfAppointment} />
          {tagsOfAppointment && tagsOfAppointment.length && (
            <div className="h-fit w-full max-w-[800px] mt-8">
              <ItemListHeader title="Tags" />
              <div className="flex flex-wrap gap-2 mt-4">
                {tagsOfAppointment?.map((tag: string, idx: number) => (
                  <Tag key={idx} name={tag} bigger={true} />
                ))}
              </div>
            </div>
          )}
        </div>

        <AppointmentBanner appointment={appointmentDetails} />
      </main>
    );
  }

  return <Loader type="main" size={80} />;
};

export default AppointmentPage;
