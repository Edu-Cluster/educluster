import React from 'react';
import { ChevronDoubleUpIcon, UserRemoveIcon } from '@heroicons/react/outline';

const MemberButtonGroup = () => {
  return (
    <div className="flex gap-4">
      <div className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100">
        <ChevronDoubleUpIcon height={25} width={25} />
      </div>
      <div className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
        <UserRemoveIcon height={25} width={25} />
      </div>
    </div>
  );
};

export default MemberButtonGroup;
