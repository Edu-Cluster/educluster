import React, { ReactNode } from 'react';
import { Cluster, LearningUnit } from '../types';
import { ChevronDownIcon } from '@heroicons/react/outline';

type Props = {
  type: Cluster | LearningUnit;
  title: string;
  description: string;
  host: string;
  room: string | null;
  participants: string[];
  maxParticipants: number;
  children: ReactNode;
};

const ListItem = ({
  type,
  title,
  description,
  host,
  room,
  participants,
  maxParticipants,
  children,
}: Props) => {
  return (
    <div className="flex flex-col justify-center items-center py-1 px-4 hover:bg-gray-100">
      <div className="w-full flex justify-between items-start mb-2">
        <div className="w-[350px] md:w-[450px] flex justify-between flex-wrap">
          <div>
            <p className="text">{title}</p>
            {children ? (
              <div className="flex gap-1 text-center">{children}</div>
            ) : (
              <></>
            )}
          </div>
          <div>
            <p className="text text-sm block">{`Host: ${host}`}</p>
            {type.category && room ? (
              <p className="text text-sm">{`Raum: ${room}`}</p>
            ) : type.category && !room ? (
              <p className="text text-sm">Raumlos</p>
            ) : (
              <p className="text text-sm"></p>
            )}
          </div>
        </div>
        {type.category ? (
          <p className="text ml-4">{`${participants.length}/${maxParticipants}`}</p>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex justify-between items-start gap-[1.80rem]">
        <div className="w-48 md:w-[500px] overflow-hidden">
          <p className="text text-sm">{description}</p>
        </div>
        <ChevronDownIcon className="inline h-6 w-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default ListItem;
