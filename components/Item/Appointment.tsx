import React, { ReactNode } from 'react';
import type { Cluster, LearningUnit } from '../../lib/types';
import Link from 'next/link';

type Props = {
  type: Cluster | LearningUnit;
  title: string;
  description: string;
  host: string;
  room: string | null;
  link: string;
  children: ReactNode;
};

const ListCluster = ({
  type,
  title,
  description,
  host,
  room,
  link,
  children,
}: Props) => {
  return (
    <div className="flex flex-col justify-center items-center py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="w-full flex justify-between items-start mb-2">
        <div className="w-[70%] flex justify-between flex-wrap">
          <div className="mr-4">
            <Link href={link}>
              <p className="text cursor-pointer text-cyan-700 hover:text-cyan-500 hover:underline fast-animate">
                {title}
              </p>
            </Link>
            {children ? (
              <div className="flex gap-1 text-center">{children}</div>
            ) : (
              <></>
            )}
          </div>

          <div>
            <p className="text-sm block">{`Ersteller: ${host}`}</p>
            {type?.category && room ? (
              <p className="text-sm">{`Raum: ${room}`}</p>
            ) : type?.category && !room ? (
              <p className="text-sm">Raumlos</p>
            ) : (
              <p className="text-sm"></p>
            )}
          </div>
        </div>
        <div className="ml-4">###</div>
      </div>

      <div className="w-full flex justify-between items-start gap-[1.80rem]">
        <div className="w-48 md:w-[400px] overflow-hidden">
          <p className="text-sm">{description}</p>
        </div>
        <div>###</div>
      </div>
    </div>
  );
};

export default ListCluster;
