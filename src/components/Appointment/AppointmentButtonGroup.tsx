import React from 'react';
import { ArrowRightIcon, TrashIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import trpc from '../../lib/trpc';
import useStore from '../../lib/store';
import { clusterAssociations } from '../../lib/enums';

type Props = {
  cluster: {
    clustername: string;
    clusterId: number;
  };
};

const AppointmentButtonGroup = ({ cluster }: Props) => {
  const { clusterAssociation } = useStore();
  const isAdmin = clusterAssociation === clusterAssociations.IS_ADMIN;
  const isMember = clusterAssociation === clusterAssociations.IS_MEMBER;

  console.log(clusterAssociation);

  const deleteAppointment = () => {
    // TODO Lara
  };

  return (
    <div className="flex flex-col gap-4">
      {isAdmin || isMember ? (
        <div className="banner-button text-emerald-500 dark:hover:text-black hover:bg-emerald-100">
          <p className="mr-2 dark:hover:text-black text-emerald-500">
            In Teams öffnen
          </p>
          <ArrowRightIcon height={20} width={20} />
        </div>
      ) : (
        <></>
      )}
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
          <p className="mr-2 dark:text-red-500 text-red-500">Termin löschen</p>
          <TrashIcon height={20} width={20} />
        </div>
      )}
    </div>
  );
};

export default AppointmentButtonGroup;
