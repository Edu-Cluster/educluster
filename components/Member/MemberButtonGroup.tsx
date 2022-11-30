import React from 'react';
import {
  ChevronDoubleUpIcon,
  UserRemoveIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/outline';

type Props = {
  isOnInvitationPage: boolean;
  showPlusButton?: boolean;
};

const MemberButtonGroup = ({ isOnInvitationPage, showPlusButton }: Props) => {
  return (
    <div className="flex gap-4">
      {!isOnInvitationPage ? (
        <>
          <div className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100">
            <ChevronDoubleUpIcon height={25} width={25} />
          </div>
          <div className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
            <UserRemoveIcon height={25} width={25} />
          </div>
        </>
      ) : (
        <>
          {showPlusButton ? (
            <>
              <div className="secondary-button h-8 w-12 flex justify-center items-center text-emerald-500 transition-colors hover:bg-emerald-100">
                <PlusIcon height={20} width={20} />
              </div>
              <div className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
                <MinusIcon height={20} width={20} />
              </div>
            </>
          ) : (
            <div className="secondary-button h-8 w-12 flex justify-center items-center text-red-500 transition-colors hover:bg-red-100">
              <MinusIcon height={20} width={20} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberButtonGroup;
