import React, { useEffect } from 'react';
import { timeTypes } from '../lib/enums';
import RegisteredSelectField from './RegisteredSelectField';
import trpc from '../lib/trpc';
import useStore from '../lib/store';

type Props = {
  preselected?: string;
  registerSelectName: string;
  timeType: timeTypes.FROM | timeTypes.TO;
  required?: boolean;
};

const TimeSelectField = ({
  preselected,
  registerSelectName,
  timeType,
  required,
}: Props) => {
  const store = useStore();
  const teachingTimesQuery = trpc.useQuery(['catalog.times'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setBeginTimes(data.times.map((obj: { begin: any }) => obj.begin));
      store.setEndTimes(data.times.map((obj: { end_: any }) => obj.end_));
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    teachingTimesQuery.refetch();
  }, []);

  return (
    <RegisteredSelectField
      preselected={preselected}
      registerSelectName={registerSelectName}
      required={required}
    >
      {timeType === timeTypes.FROM ? (
        <>
          {store.beginTimes &&
            store.beginTimes.map((time: any, idx: any) => (
              <option
                key={idx}
                value={Number(time.split(':').join('')).toString()}
              >
                {time}
              </option>
            ))}
        </>
      ) : (
        <>
          {store.endTimes &&
            store.endTimes.map((time: any, idx: any) => (
              <option
                key={idx}
                value={Number(time.split(':').join('')).toString()}
              >
                {time}
              </option>
            ))}
        </>
      )}
    </RegisteredSelectField>
  );
};

export default TimeSelectField;
