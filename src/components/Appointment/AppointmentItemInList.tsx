import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  description: string | null;
  creator: string;
  roomname: string | null;
  link: string;
  children: ReactNode;
};

const AppointmentItemInList = ({
  title,
  description,
  creator,
  roomname,
  link,
  children,
}: Props) => {
  return (
    <div className="flex flex-col justify-center items-center py-1 px-4 hover:bg-gray-100 dark:hover:bg-slate-800 fast-animate">
      <div className="w-full flex justify-between items-start mb-2">
        <div className="w-full flex justify-between flex-wrap">
          <div className="mr-4">
            <Link href={link}>
              <p className="cursor-pointer text-cyan-700 dark:text-cyan-700 hover:text-cyan-500 hover:underline fast-animate">
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
            <span className="text-sm block">
              erstellt von
              <p className="text-sm ml-1 text-cyan-700 dark:text-cyan-700">
                {creator}
              </p>
            </span>
            {roomname ? (
              <p className="text-sm">{`Raum: ${roomname}`}</p>
            ) : !roomname ? (
              <p className="text-sm">Raumlos</p>
            ) : (
              <p className="text-sm"></p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-start gap-[1.80rem]">
        <div className="w-48 md:w-[400px] overflow-hidden">
          {description ? <p className="text-sm">{description}</p> : <></>}
        </div>
        <div>###</div>
      </div>
    </div>
  );
};

export default AppointmentItemInList;
