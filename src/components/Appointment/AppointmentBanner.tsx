import Avatar from '../Avatar';
import React from 'react';
import Link from 'next/link';
import AppointmentButtonGroup from './AppointmentButtonGroup';

type Props = {
  appointment: any;
};

const AppointmentBanner = ({ appointment }: Props) => {
  const appointmentname = appointment?.name;
  const description = appointment?.description;
  const person = {
    username: appointment?.person?.username,
  };
  const cluster = {
    clustername: appointment?.cluster_appointmentTocluster?.clustername,
    clusterId: appointment?.cluster,
  };
  const room = appointment?.roomname ?? 'Raumlos';

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
          <p className="text-xl">/</p> {room}
        </span>
        <span className="mt-3 text-sm">
          erstellt von{' '}
          <p className="align-baseline text-sm text-cyan-700 dark:text-cyan-700">
            {person.username}
          </p>
        </span>
        <p className="mt-4 break-words break-word text-[16px]">{description}</p>
      </div>
      <AppointmentButtonGroup cluster={cluster} />
    </div>
  );
};

export default AppointmentBanner;
