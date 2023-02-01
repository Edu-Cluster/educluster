import Avatar from '../Avatar';
import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/outline';

const AppointmentBanner = () => {
  // TODO Lara: Untere Daten aus Store holen wenn die DB-Abfrage existiert
  const appointmentname = 'TEST';
  const description = 'test';
  const person = {
    username: 'testperson',
  };
  const cluster = {
    clustername: 'testcluster',
    clusterId: 1,
  };
  const isRoomless = false;

  return (
    <div className="h-[700px] w-full max-w-[800px] sm:min-w-[400px] screen-xxl:max-w-[400px] card mt-16 px-8 flex flex-col items-center justify-around">
      <div className="h-auto flex flex-col items-center mt-2">
        <p className="text-md underline">APPOINTMENT</p>
        <p className="text-2xl">{appointmentname}</p>
        <div className="mt-12 w-full h-24 flex justify-center items-center">
          <Avatar type="thing" seed={appointmentname} bigger={true} />
        </div>
        <span className="mt-12">
          <Link href={`/cluster/${cluster.clustername}*${cluster.clusterId}`}>
            <p className="cursor-pointer text-cyan-700 dark:text-cyan-700 hover:text-cyan-500 hover:underline fast-animate">
              {cluster.clustername}
            </p>
          </Link>{' '}
          / {isRoomless ? 'Raumlos' : 'V_101'}
        </span>
        <span className="mt-3 text-sm">
          erstellt von{' '}
          <p className="align-baseline underline">{person.username}</p>
        </span>
        <p className="mt-4 break-words break-word text-[16px]">{description}</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="cluster-button text-emerald-500 dark:hover:text-black hover:bg-emerald-100">
          <p className="mr-2 dark:hover:text-black text-emerald-500">
            Termin beitreten
          </p>
          <ArrowRightIcon height={20} width={20} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentBanner;
