import React, { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  title: string;
  description: string | null;
  creator: string;
  roomname: string | null;
  dateFrom: Date;
  dateTo: Date;
  link: string;
  children: ReactNode;
};

const AppointmentItemInList = ({
  title,
  description,
  creator,
  roomname,
  dateFrom,
  dateTo,
  link,
  children,
}: Props) => {
  const dateFromDay =
    dateFrom.getDate().toString().length === 1
      ? `0${dateFrom.getDate()}`
      : dateFrom.getDate();
  const dateFromMonth =
    (dateFrom.getMonth() + 1).toString().length === 1
      ? `0${dateFrom.getMonth() + 1}`
      : dateFrom.getMonth() + 1;
  const dateFromString = `${dateFrom.getFullYear()}-${dateFromMonth}-${dateFromDay}`;

  const dateToDay =
    dateTo.getDate().toString().length === 1
      ? `0${dateTo.getDate()}`
      : dateTo.getDate();
  const dateToMonth =
    (dateTo.getMonth() + 1).toString().length === 1
      ? `0${dateTo.getMonth() + 1}`
      : dateTo.getMonth() + 1;
  const dateToString = `${dateTo.getFullYear()}-${dateToMonth}-${dateToDay}`;

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
              <span className="text-sm block">
                {' '}
                Raum:
                <p className="text-sm ml-1 text-cyan-700 dark:text-cyan-700">
                  {roomname}
                </p>
              </span>
            ) : (
              <p className="text-sm text-cyan-700 dark:text-cyan-700">
                Raumlos
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-start gap-[1.80rem]">
        <div className="overflow-hidden">
          {description ? <p className="text-sm">{description}</p> : <></>}
        </div>
        <div className="md:min-w-[200px] text-sm">
          von{' '}
          <p className="text-sm text-cyan-700 dark:text-cyan-700">
            {dateFromString}
          </p>{' '}
          bis{' '}
          <p className="text-sm text-cyan-700 dark:text-cyan-700">
            {dateToString}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItemInList;
