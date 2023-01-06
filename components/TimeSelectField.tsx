import React, { useEffect } from 'react';
import { timeTypes } from '../lib/enums';
import SelectField from './SelectField';
import trpc from '../client/trpc';
import useStore from '../client/store';

type Props = {
  preselected: string;
  registerSelectName: string;
  timeType: timeTypes.FROM | timeTypes.TO;
};

const TimeSelectField = ({
  preselected,
  registerSelectName,
  timeType,
}: Props) => {
  const store = useStore();
  const teachingTimesQuery = trpc.useQuery(['catalog.times'], {
    enabled: false,
    onSuccess: async ({ data }) => {
      store.setBeginTimes(data.times.map((obj: { begin: any }) => obj.begin));
      store.setEndTimes(data.times.map((obj: { end: any }) => obj.end));
    },
    onError: async (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    teachingTimesQuery.refetch();
  }, []);

  return (
    <SelectField
      preselected={preselected}
      registerSelectName={registerSelectName}
    >
      {timeType === timeTypes.FROM ? (
        <>
          {store.beginTimes &&
            store.beginTimes.map((time: any, idx: any) => (
              <option key={idx} value={time}>
                {time}
              </option>
            ))}
        </>
      ) : (
        <>
          {store.endTimes &&
            store.endTimes.map((time: any, idx: any) => (
              <option key={idx} value={time}>
                {time}
              </option>
            ))}
        </>
      )}
    </SelectField>
  );
};

export default TimeSelectField;
