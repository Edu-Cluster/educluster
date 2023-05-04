import React from 'react';
import { ArrowRightIcon, TrashIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import trpc from '../../lib/trpc';
import useStore from '../../lib/store';
import { clusterAssociations } from '../../lib/enums';
import toast from 'react-hot-toast';

type Props = {
  cluster: {
    clustername: string;
    clusterId: number;
  };
  appointment: any;
};

const AppointmentButtonGroup = ({ cluster, appointment }: Props) => {
  const { clusterAssociation, userOfAppointment, authUser } = useStore();
  const isAdmin = clusterAssociation === clusterAssociations.IS_ADMIN;
  const id = appointment?.id;
  const name = appointment?.name;

  const { mutate: sendAppointmentDeletedWarningMutation } = trpc.useMutation(
    ['notification.warningAppointmentDeleted'],
    {
      onSuccess: () => {
        document.location.href = '../../';
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const { mutate: deleteAppointmentMutation } = trpc.useMutation(
    ['item.deleteAppointment'],
    {
      onSuccess: () => {
        const userIds: bigint[] = [];

        userOfAppointment.forEach((userArr: any) => {
          userArr.forEach((user: any) => {
            if (authUser && user.username !== authUser.username) {
              userIds.push(user.id);
            }
          });
        });

        sendAppointmentDeletedWarningMutation({
          userIds,
          appointmentId: id,
          appointmentName: name,
        });
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const deleteAppointment = () => {
    toast.loading('Termin wird abgesagt...');
    deleteAppointmentMutation(id);
  };

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/cluster/${cluster.clustername}*${cluster.clusterId}`}>
        <div className="banner-button text-yellow-500 dark:hover:text-black hover:bg-yellow-100">
          <p className="mr-2 dark:hover:text-black text-yellow-500">
            Zum Cluster
          </p>
          <ArrowRightIcon height={20} width={20} />
        </div>
      </Link>
      {isAdmin && (
        <div
          className="banner-button text-red-500 hover:bg-red-100 dark:hover:bg-red-100"
          onClick={deleteAppointment}
        >
          <p className="mr-2 dark:text-red-500 text-red-500">Termin absagen</p>
          <TrashIcon height={20} width={20} />
        </div>
      )}
    </div>
  );
};

export default AppointmentButtonGroup;
