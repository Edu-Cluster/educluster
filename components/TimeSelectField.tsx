import React from 'react';
import RegisteredSelectField from './RegisteredSelectField';
import { timeTypes } from '../lib/enums';

type Props = {
  preselected: string;
  registerSelectName: string;
  timeType: timeTypes.FROM | timeTypes.TO;
};

const fromTimes = [
  '07:25',
  '08:15',
  '09:10',
  '10:00',
  '11:05',
  '11:55',
  '13:10',
  '14:00',
  '14:50',
  '15:50',
  '16:40',
  '17:30',
  '18:20',
  '19:10',
  '20:00',
  '20:50',
  '21:40',
  '22:30',
];

const toTimes = [
  '08:15',
  '09:05',
  '10:00',
  '10:50',
  '11:55',
  '12:45',
  '14:00',
  '14:50',
  '15:40',
  '16:40',
  '17:30',
  '18:20',
  '19:10',
  '20:00',
  '20:50',
  '21:40',
  '22:30',
  '23:30',
];

const TimeSelectField = ({
  preselected,
  registerSelectName,
  timeType,
}: Props) => {
  return (
    <RegisteredSelectField
      preselected={preselected}
      registerSelectName={registerSelectName}
    >
      {timeType === timeTypes.FROM ? (
        <>
          {fromTimes.map((time, idx) => (
            <option key={idx} value={time}>
              {time}
            </option>
          ))}
        </>
      ) : (
        <>
          {toTimes.map((time, idx) => (
            <option key={idx} value={time}>
              {time}
            </option>
          ))}
        </>
      )}
    </RegisteredSelectField>
  );
};

export default TimeSelectField;
