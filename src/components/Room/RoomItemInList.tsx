import React, { useState } from 'react';
import {
  CheckCircleIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import { conditionSatisfactionTypes } from '../../lib/enums';
import useStore from '../../lib/store';
import SelectField from '../SelectField';

type Props = {
  name: string;
  id: string;
  conditionsSatisfied: conditionSatisfactionTypes;
};

const RoomItemInList = ({ name, id, conditionsSatisfied }: Props) => {
  const { roomAvailabilities } = useStore();
  const [conditionFulfilled, setConditionFulfilled] = useState(false);

  let ConditionSatisfaction;
  let conditionSatisfactionNotice = '';

  switch (conditionsSatisfied) {
    case conditionSatisfactionTypes.SATISFIED:
      ConditionSatisfaction = <CheckIcon className="text-green-600 h-8 w-8" />;
      conditionSatisfactionNotice = 'Erfüllt Bedingungen';
      break;
    case conditionSatisfactionTypes.SEMISATISFIED:
      ConditionSatisfaction = (
        <QuestionMarkCircleIcon className="text-orange-400 h-8 w-8" />
      );
      conditionSatisfactionNotice = 'Erfüllt Bedingungen teilweise';
      break;
    case conditionSatisfactionTypes.UNSATISFIED:
      ConditionSatisfaction = <XIcon className="text-red-600 h-8 w-8" />;
      conditionSatisfactionNotice = 'Erfüllt Bedingungen nicht';
      break;
  }

  const onAvailabilitiesChanged = (value: any) => {
    if (value !== '-1') {
      setConditionFulfilled(true);
    } else {
      setConditionFulfilled(false);
    }
  };

  return (
    <div
      className="py-1 px-4 hover:bg-gray-100 dark:hover:bg-slate-800 fast-animate"
      id={id}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center w-32">
          {ConditionSatisfaction}
          <p className="text text-xl cursor-pointer text-cyan-700 dark:text-cyan-700 hover:text-cyan-500 hover:underline fast-animate ml-2">
            {name}
          </p>
        </div>
        {!conditionFulfilled ? (
          <p className="text text-[16px]">{conditionSatisfactionNotice}</p>
        ) : (
          <></>
        )}
        {conditionsSatisfied === conditionSatisfactionTypes.SATISFIED ? (
          <div className="banner-button text-emerald-500 dark:hover:text-black hover:bg-emerald-100">
            <p className="mr-2 dark:hover:text-black text-emerald-500">
              Auswählen
            </p>
            <CheckCircleIcon height={20} width={20} />
          </div>
        ) : conditionsSatisfied === conditionSatisfactionTypes.SEMISATISFIED ? (
          <div
            className={`flex items-center gap-4${
              conditionFulfilled ? ' w-full' : ''
            }`}
          >
            <SelectField
              name="availabilities"
              preselected="-"
              onChangeHandler={onAvailabilitiesChanged}
            >
              {roomAvailabilities
                ?.get(id)
                .map((availability: number, idx: number) => (
                  <option value={availability} key={idx}>
                    {`${availability.toString().slice(0, 4)}-${availability
                      .toString()
                      .slice(4, 6)}-${availability.toString().slice(6, 8)}`}
                  </option>
                ))}
            </SelectField>
            {conditionFulfilled ? (
              <div className="banner-button text-emerald-500 dark:hover:text-black hover:bg-emerald-100">
                <p className="mr-2 dark:hover:text-black text-emerald-500">
                  Auswählen
                </p>
                <CheckCircleIcon height={20} width={20} />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="h-8 w-52"></div>
        )}
      </div>
    </div>
  );
};

export default RoomItemInList;
