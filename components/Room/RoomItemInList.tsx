import React from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  XIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { conditionSatisfactionTypes } from '../../lib/enums';

type Props = {
  name: string;
  link: string;
  conditionsSatisfied: conditionSatisfactionTypes;
};

const RoomItemInList = ({ name, link, conditionsSatisfied }: Props) => {
  let ConditionSatisfaction;

  switch (conditionsSatisfied) {
    case conditionSatisfactionTypes.SATISFIED:
      ConditionSatisfaction = <CheckIcon className="text-green-600 h-8 w-8" />;
      break;
    case conditionSatisfactionTypes.SEMISATISFIED:
      ConditionSatisfaction = (
        <QuestionMarkCircleIcon className="text-orange-400 h-8 w-8" />
      );
      break;
    case conditionSatisfactionTypes.UNSATISFIED:
      ConditionSatisfaction = <XIcon className="text-red-600 h-8 w-8" />;
      break;
  }

  return (
    <div className="py-1 px-4 hover:bg-gray-100 fast-animate">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          {ConditionSatisfaction}
          <Link href={link}>
            <p className="text text-xl cursor-pointer text-cyan-700 hover:text-cyan-500 hover:underline fast-animate ml-2">
              {name}
            </p>
          </Link>
        </div>
        <p className="text text-[16px]">Erfüllt Bedingungen</p>
        <p className="text text-md"># Sitzplätze</p>
      </div>
    </div>
  );
};

export default RoomItemInList;
